const { sequelize, testConnection } = require('../config/database');
const User = require('./User');
const Session = require('./Session');

User.hasMany(Session, {
    foreignKey: 'userId',
    as: 'sessions'
});

Session.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Database sync failed:', error.message);
    }
};

module.exports = {
    sequelize,
    testConnection,
    syncDatabase,
    User,
    Session
};