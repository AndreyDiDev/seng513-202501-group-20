export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'normal',
      },
    });
  
    User.associate = models => {
      User.hasMany(models.Recipe, { foreignKey: 'createdBy' });
      User.hasMany(models.Comment, { foreignKey: 'userId' });
    };
  
    return User;
  };
  