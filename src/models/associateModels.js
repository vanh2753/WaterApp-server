const Job = require('./Job');
const JobHistory = require('./JobHistory');
const Meter = require('./Meter');
const Notification = require('./Notification');
const Photo = require('./Photo');
const User = require('./User');

const applyAssociations = () => {
    Job.hasMany(JobHistory, { foreignKey: 'job_id' });
    JobHistory.belongsTo(Job, { foreignKey: 'job_id' });

    Job.hasMany(Photo, { foreignKey: 'job_id' });
    Photo.belongsTo(Job, { foreignKey: 'job_id' });

    Job.belongsTo(Meter, { foreignKey: 'meter_id_old', as: 'OldMeter' });
    Job.belongsTo(Meter, { foreignKey: 'meter_id_new', as: 'NewMeter' });

    User.hasMany(Job, { foreignKey: 'responsible_user_id' });
    Job.belongsTo(User, { foreignKey: 'responsible_user_id' });

    Notification.belongsTo(User, { foreignKey: 'user_id' });
    Notification.belongsTo(Job, { foreignKey: 'job_id' });

    User.hasMany(Notification, { foreignKey: 'user_id' });
    Job.hasMany(Notification, { foreignKey: 'job_id' });
}

module.exports = applyAssociations
