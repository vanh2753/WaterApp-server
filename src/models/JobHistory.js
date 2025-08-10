const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class JobHistory extends Model { }

JobHistory.init({
    history_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
},
    {
        sequelize,
        modelName: 'JobHistory',
        tableName: 'job_histories',
        timestamps: true,
    }
)

module.exports = JobHistory