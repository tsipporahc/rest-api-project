'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs'); // hashes passwords
module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init(
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'A first name is required.',
                    },
                    notEmpty: {
                        msg: 'Please provide a first name.',
                    },
                },
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'A last name is required.',
                    },
                    notEmpty: {
                        msg: 'Please provide a last name.',
                    },
                },
            },
            emailAddress: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: {
                    msg: 'The email you entered already exists.',
                },
                validate: {
                    notNull: {
                        msg: 'An email address name is required.',
                    },
                    isEmail: {
                        msg: 'Please provide a valid email address.',
                    },
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                set(val) {
                    var hashPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('password', hashPassword);
                    //this.setDataValue('password', bcrypt.hashSync(val));
                },
                validate: {
                    notNull: {
                        msg: 'A password is required.',
                    },
                    notEmpty: {
                        msg: 'Please provide a password.',
                    },
                },
            },
        },
        { sequelize }
    );

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: { fieldName: 'userId' },
        }); // a user can be associated with many courses
    };
    return User;
};
