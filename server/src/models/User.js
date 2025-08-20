const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class User extends Model { }

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    role: {
        type: DataTypes.ENUM('admin', 'TP', 'GT', 'QLM', 'TT', 'KT', 'KD'),
        allowNull: false,
    },
},
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
    }
)

module.exports = User;