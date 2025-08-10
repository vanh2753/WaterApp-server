const router = require('express').Router()
const { login, signup, refreshToken } = require('../controllers/user-controllers')

router.post('/login', login)
router.post('/signup', signup)
router.get('/refresh-token', refreshToken)

module.exports = router