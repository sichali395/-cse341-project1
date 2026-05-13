const router = require('express').Router();

// Root path
router.get('/', (req, res) => { 
    res.send('Hello World!'); 
});

// Link the contacts route file
router.use('/contacts', require('./contacts'));

module.exports = router;