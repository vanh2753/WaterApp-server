const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateAccessToken = (user_id, role) => {
    const access_token = jwt.sign({ user_id, role }, process.env.ACCESS_TOKEN_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE })
    return access_token
}

const generateRefreshToken = (user_id) => {
    const refresh_token = jwt.sign({ user_id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE })
    return refresh_token
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_KEY)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}