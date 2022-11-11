'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init(
        {
            title: {
                type: Sequelize.STRING,
                primaryKey: true,
                autoIncrement: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            estimatedTime: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            materialsNeeded: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            /* userId: {
                type: Sequelize.STRING,
                allowNull: false,
            }, */
        },
        { sequelize }
    );

    Course.associate = (models) => {
        Course.belongsTo(models.User, { foreignKey: 'userId' }); // a course can be associated with one user
    };
    return Course;
};
