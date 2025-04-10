const User = (sequelize, DataTypes) => {
    return sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        // hashedPassword: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     validate: {
        //         notEmpty: true,
        //     },
        // },
    });
};

export default User;
