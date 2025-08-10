const sequelize = require('../configs/db-config')
const Job = require('./Job');
const JobHistory = require('./JobHistory');
const Meter = require('./Meter');
const Notification = require('./Notification');
const Photo = require('./Photo');
const User = require('./User');

const applyAssociations = require('./associateModels');

applyAssociations(); //áp quan hệ cho các model

module.exports = {
    sequelize,
    Job,
    JobHistory,
    Meter,
    Notification,
    Photo,
    User,
}; //luôn import model và sequelize tại đây