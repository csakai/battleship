var router = require('express').Router()

router.use('/games', require('./api/games'))

module.exports = router;
