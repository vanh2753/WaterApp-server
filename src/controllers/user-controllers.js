const { User } = require('../models/index')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../services/user-service')

const signup = async (req, res, next) => {
    try {
        const { username, full_name, email, password, role } = req.body
        if (!username || !full_name || !email || !password || !role) {
            return res.status(400).json({
                EC: 1,
                EM: "Thiếu thông tin",
            });
        }

        const checkExistUser = await User.findOne({ where: { username: username } })
        if (checkExistUser) {
            return res.status(400).json({
                EC: 1,
                EM: "Tài khoản đã tồn tại",
            });
        }

        const hashPassword = bcrypt.hashSync(password, saltRounds);

        const user = await User.create({
            username: username,
            full_name: full_name,
            email: email,
            password: hashPassword,
            role: role
        })
        return res.status(201).json({
            EC: 0,
            EM: "Đăng ký tài khoản thành công",
            DT: user
        });

    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                EC: 1,
                EM: "Nhập đầy đủ email và mật khẩu!"
            })
        }

        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return res.status(400).json({
                EC: 1,
                EM: "Email không tồn tại"
            })
        }

        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                EC: 1,
                EM: "Sai mật khẩu"
            })
        }

        const access_token = generateAccessToken(user.user_id, user.role)
        const refresh_token = generateRefreshToken(user.user_id)

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS khi ở môi trường production
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie hết hạn sau 7 ngày
        });

        // Không trả về mật khẩu
        const userData = {
            user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }

        return res.status(200).json({
            EC: 0,
            EM: "Đăng nhập thành cong",
            DT: {
                user: userData,
                access_token: access_token
            }
        })


    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({
                EC: 1,
                EM: "Không có refresh token"
            })
        }

        const decoded = verifyRefreshToken()
        const user = await User.findOne({ where: { user_id: decoded.id } })
        if (!user) {
            return res.status(400).json({
                EC: 1,
                EM: "Xác thực thất bại"
            })
        }

        const access_token = generateAccessToken(user.user_id, user.role)

        return res.status(200).json({
            EC: 0,
            EM: "Refresh token thành công",
            DT: {
                access_token: access_token
            }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup,
    login,
    refreshToken
}