export default (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
  
    Comment.associate = models => {
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
      Comment.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    };
  
    return Comment;
  };
  