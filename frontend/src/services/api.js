const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// Auth API
export const authAPI = {
    register: async (username, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (data.data.token) {
            localStorage.setItem('token', data.data.token);
        }
        return data;
    },

    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (data.data.token) {
            localStorage.setItem('token', data.data.token);
        }
        return data;
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
    };

    // Session API
    export const sessionAPI = {
    start: async (pomodoroCount = 1) => {
        const response = await fetch(`${API_URL}/session/start`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ pomodoroCount })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    update: async (sessionId, distractionDetected, detectedObjects) => {
        const response = await fetch(`${API_URL}/session/${sessionId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ distractionDetected, detectedObjects })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    end: async (sessionId) => {
        const response = await fetch(`${API_URL}/session/${sessionId}/end`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    getHistory: async (page = 1, limit = 10) => {
        const response = await fetch(`${API_URL}/session/history?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    getLeaderboard: async (limit = 10) => {
        const response = await fetch(`${API_URL}/session/leaderboard?limit=${limit}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    }
};