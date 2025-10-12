const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER, // in seconds
        allowNull: true
    },
    pomodoroCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 0
        }
    },
    distractionCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    pointsEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    detectedObjects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'abandoned'),
        defaultValue: 'active'
    },
    focusPercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 100.0,
        validate: {
            min: 0,
            max: 100
        }
    }
}, {
    tableName: 'sessions',
    timestamps: true
});

module.exports = Session;