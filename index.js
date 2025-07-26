const express = require('express');
const cors = require('cors');
const googletts = require('./googletts.js');
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
    res.end(async () => {
        console.log('Start');
        const output1 = await googletts.hypnosisRecording(
            'output1.wav',
            '<speak><p><s>Hola Oscar, bienvenido a esta sesión de relajación profunda.</s> <s>Encuentra una posición cómoda, ya sea sentado o acostado, donde puedas relajarte completamente.</s> <break time="4s"/> <s>Cierra suavemente tus ojos y permite que tu respiración se vuelva natural y tranquila.</s></p></speak>',
            'es-ES-Studio-F',
            'es-ES',
            'orderpaid',
            'true'
        );
        console.log('1 done');
        const output2 = await googletts.hypnosisRecording(
            'output1.wav',
            '<speak><p><s>Hola Oscar, bienvenido a esta sesión de relajación profunda.</s> <s>Encuentra una posición cómoda, ya sea sentado o acostado, donde puedas relajarte completamente.</s> <break time="4s"/> <s>Cierra suavemente tus ojos y permite que tu respiración se vuelva natural y tranquila.</s></p></speak>',
            'es-ES-Studio-F',
            'es-ES',
            'orderpaid',
            'true'
        );
        console.log('2 done');
        console.log(output1);
        console.log(output2);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});