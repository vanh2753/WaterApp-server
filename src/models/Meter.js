const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class Meter extends Model { }

Meter.init({
    meter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    serial_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Sử dụng', 'Hỏng'),
        allowNull: false,
        defaultValue: 'Sử dụng'
    },
},
    {
        sequelize,
        modelName: 'Meter',
        tableName: 'meters',
        timestamps: true
    }
);

module.exports = Meter;