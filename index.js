const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const KEY = process.env.KEY;
// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

app.use(cors({
    // origin: [FRONTEND_ORIGIN],
    origin: [], // Accept all origins
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.get('/', (req, res) => {
    console.log('home');
    res.status(200).json({ message: 'It Works!' });
});

app.post('/concat', (req, res) => {
    res.status(200).json({ message: 'POST new item', dataReceived: req.body });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});