const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan('combined'));

app.use((req, res, next) => {
    const startHrTime = process.hrtime();

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        console.log(`Method: ${req.method}`);
        console.log(`URL: ${req.originalUrl}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response Time: ${elapsedTimeInMs.toFixed(3)} ms`);
        console.log(`IP: ${req.ip}`);
        console.log(`User-Agent: ${req.get('User-Agent')}`);
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/data', (req, res) => {
    res.json({ message: 'GET request to /data' });
});

app.post('/data', (req, res) => {
    res.json({ message: 'POST request to /data', data: req.body });
});

app.put('/data', (req, res) => {
    res.json({ message: 'PUT request to /data', data: req.body });
});

app.delete('/data', (req, res) => {
    res.json({ message: 'DELETE request to /data' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
