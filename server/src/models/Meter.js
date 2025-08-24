const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class Meter extends Model { }

Meter.init(
    {
        meter_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        serial_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        customer_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(
                'Sử dụng',
                "Chạy nhanh",
                "Chạy chậm",
                "Kẹt đồng hồ",
                "Vỡ mặt",
                "Mất cắp",
                "Khác"
            ),
            allowNull: false,
            defaultValue: "Sử dụng",
        },
        note: {
            type: DataTypes.STRING(255),
            allowNull: true, // chỉ có giá trị khi status = 'Khác'
        },
    },
    {
        sequelize,
        modelName: "Meter",
        tableName: "meters",
        timestamps: true,
    }
);

module.exports = Meter;
