const router = require('express').Router();

// 1. Root path route handler
router.get('/', (req, res) => { 
    res.send('Hello World!'); 
});

// 2. Link the contacts sub-routes
router.use('/contacts', require('./contacts'));

module.exports = router;
