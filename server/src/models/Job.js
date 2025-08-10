const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class Job extends Model { }

Job.init({
    job_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM(
            'Mới',
            'Chờ Thanh tra',
            'Đã thay thế',
            'Đã cập nhật hệ thống',
            'Xúc xả thành công',
            'Xúc xả thất bại'
        ),
        allowNull: false,
    },
    responsible_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    task_type: {
        type: DataTypes.ENUM('Ghi thu', 'QL Mạng', 'Thanh tra', 'Kỹ thuật', 'Kinh doanh'),
        allowNull: false,
    },
    meter_id_old: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    meter_id_new: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    meter_book_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    meter_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    failure_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    replacement_serial: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    emergency_replacement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    photo_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
},
    {
        sequelize,
        modelName: 'Job',
        tableName: 'jobs',
        timestamps: true,
    }
)

module.exports = Job