
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        EC: 1,
        EM: "Server error",
    });
};

module.exports = errorHandler;
