const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// A simple proxy route if the frontend wants to hide the pollinations usage eventually
app.post('/api/generate', async (req, res) => {
    try {
        const { messages, model } = req.body;
        
        // This is where you would normally call the Pollinations API Server-to-Server
        // to hide keys. Since it's currently on the frontend, this just acts as a stub.
        
        res.json({ 
            success: true, 
            message: "Backend is operational. Currently, direct generation happens on the frontend.",
            received: { model }
        });
        
    } catch (error) {
        console.error('Error in generation:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
