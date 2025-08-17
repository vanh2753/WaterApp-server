
const { verifyAccessToken } = require("../services/user-service")

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1] //lấy access_token
        if (!token) {
            return res.status(401).json({
                EC: 1,
                EM: "No token found"
            })
        }

        const decode = verifyAccessToken(token)
        req.user = decode
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                EC: 1,
                EM: "Access token expired"
            });
        }
        return res.status(401).json({
            EC: 1,
            EM: "Invalid access token"
        });
    }
}

module.exports = { authenticateToken }