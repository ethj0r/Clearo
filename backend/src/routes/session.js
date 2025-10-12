const express = require('express');
const {
  startSession,
  updateSession,
  endSession,
  getSessionHistory,
  getLeaderboard
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/start', startSession);
router.put('/:id', updateSession);
router.post('/:id/end', endSession);
router.get('/history', getSessionHistory);
router.get('/leaderboard', getLeaderboard);

module.exports = router;