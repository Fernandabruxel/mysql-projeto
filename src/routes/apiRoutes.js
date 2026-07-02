const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        versao: process.env.API_VERSION || '2.0.0',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

router.get('/versao', (req, res) => {
    res.json({
        versao: process.env.API_VERSION || '2.0.0',
        status: 'online'
    });
});

module.exports = router;