const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection, syncDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/session');

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://clearo-by-ethjor.vercel.app',
        'https://clearo-git-main-ethj0r.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Clearo API is running',
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testConnection();
        await syncDatabase();
        
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();