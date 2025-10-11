const { Session, User, sequelize } = require('../models');

const calculatePoints = (session) => {
    let points = 0;

    points += session.pomodoroCount * 10;

    // Streak bonus
    const user = session.user || session.User;
    if (user) {
        const streak = user.currentStreak;
        if (streak >= 3) points += 5;
        if (streak >= 7) points += 15;
        if (streak >= 30) points += 50;
    }

    points -= session.distractionCount * 2;
    if (session.distractionCount === 0) points += 5;

    return Math.max(0, points);
};

/**
 * @desc    Start new pomodoro session
 * @route   POST/api/session/start
 * @access  Private
 */
const startSession = async (req, res) => {
    try {
        const { pomodoroCount = 1 } = req.body;

        const session = await Session.create({
            userId: req.user.id,
            pomodoroCount,
            startTime: new Date(),
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Session started',
            data: session
        });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start session',
            error: error.message
        });
    }
};

/**
 * @desc    Update session (report distraction)
 * @route   PUT /api/session/:id
 * @access  Private
 */
const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { distractionDetected, detectedObjects } = req.body;

        const session = await Session.findOne({
            where: {
                id,
                userId: req.user.id,
                status: 'active'
            }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Active session not found'
            });
        }

        // Update distraction count
        if (distractionDetected) {
            session.distractionCount += 1;
        }

        // Update detected objects
        if (detectedObjects && Array.isArray(detectedObjects)) {
            session.detectedObjects = detectedObjects;
        }

        // calc focus percentage
        const totalTime = (new Date() - session.startTime) / 1000;
        const distractionTime = session.distractionCount * 10;
        session.focusPercentage = Math.max(0, ((totalTime - distractionTime) / totalTime) * 100);

        await session.save();

        res.status(200).json({
            success: true,
            message: 'Session updated',
            data: session
        });
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update session',
            error: error.message
        });
    }
};

/**
 * @desc    End session and calculate points
 * @route   POST /api/session/:id/end
 * @access  Private
 */
const endSession = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;

        const session = await Session.findOne({
            where: {
                id,
                userId: req.user.id,
                status: 'active'
            },
            include: [{ model: User, as: 'user' }]
        });

        if (!session) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Active session not found'
            });
        }

        const endTime = new Date();
        const duration = Math.floor((endTime - session.startTime) / 1000);

        session.endTime = endTime;
        session.duration = duration;
        session.status = 'completed';

        const pointsEarned = calculatePoints(session);
        session.pointsEarned = pointsEarned;

        await session.save({ transaction: t });
        const user = await User.findByPk(req.user.id, { transaction: t });
        user.totalPoints += pointsEarned;

        const today = new Date().toISOString().split('T')[0];
        const lastActive = user.lastActiveDate;

        if (!lastActive) {
            user.currentStreak = 1;
        } else {
            const lastActiveDate = new Date(lastActive);
            const diffDays = Math.floor((new Date(today) - lastActiveDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.currentStreak += 1;
            } else if (diffDays > 1) {
                user.currentStreak = 1;
            }
        }

        // Update longest streak
        if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
        }

        user.lastActiveDate = today;
        await user.save({ transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            message: 'Session completed',
            data: {
                session,
                pointsEarned,
                totalPoints: user.totalPoints,
                currentStreak: user.currentStreak
            }
        });
    } catch (error) {
        await t.rollback();
        console.error('End session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to end session',
            error: error.message
        });
    }
};

/**
 * @desc    Get session history
 * @route   GET /api/session/history
 * @access  Private
 */
const getSessionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: sessions } = await Session.findAndCountAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
        success: true,
        data: {
            sessions,
            pagination: {
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit)
            }
        }
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get session history',
            error: error.message
        });
    }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/session/leaderboard
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const users = await User.findAll({
            attributes: ['id', 'username', 'totalPoints', 'currentStreak', 'longestStreak'],
            order: [['totalPoints', 'DESC']],
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get leaderboard',
            error: error.message
        });
    }
};

module.exports = {
    startSession,
    updateSession,
    endSession,
    getSessionHistory,
    getLeaderboard
};