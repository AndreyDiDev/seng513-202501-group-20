export default (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: DataTypes.STRING,
    calories: DataTypes.INTEGER,
    instructions: DataTypes.TEXT,
  });

  Recipe.associate = models => {
    Recipe.belongsTo(models.User, { foreignKey: 'createdBy' });
    Recipe.hasMany(models.Comment, { foreignKey: 'recipeId' });

    // Many-to-many with Ingredient
    Recipe.belongsToMany(models.Ingredient, {
      through: 'RecipeIngredient',
      foreignKey: 'recipeId',
    });
  };

  return Recipe;
};
