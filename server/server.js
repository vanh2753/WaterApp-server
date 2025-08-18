const express = require('express')
const app = express()
process.env.DOTENV_CONFIG_QUIET = 'true';
require('dotenv').config()
const port = process.env.PORT || 8080
const database = require('./src/models/index')
const errorHandler = require('./src/ultis/errorHandler')
const cors = require('cors');
const cookieParser = require('cookie-parser');

//routes
const userRoute = require('./src/routes/user-route')
const jobRoute = require('./src/routes/job-route')


const corsOptions = {
    origin: process.env.CLIENT_DOMAIN, // frontend domain
    credentials: true, // Cho phép gửi cookie từ frontend sang backend
};

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));
app.use(cookieParser());

//use routes
app.use('/api', userRoute)
app.use('/api', jobRoute)


// Database connection
const connectDB = async () => {
    try {
        await database.sequelize.authenticate()
        console.log('Connect DB success')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
connectDB()// Auto connect to database

database.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced')
})


app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})