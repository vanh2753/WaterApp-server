const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configs/db-config');

class Photo extends Model { }

Photo.init({
    photo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    photo_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        sequelize,
        modelName: 'Photo',
        tableName: 'photos',
        timestamps: true,
    })

module.exports = Photo