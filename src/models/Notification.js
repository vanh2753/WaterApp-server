const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class Notification extends Model { }

Notification.init({
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
},
    {
        sequelize,
        modelName: 'Notification',
        tableName: 'notifications',
        timestamps: true,
    }
)

module.exports = Notification