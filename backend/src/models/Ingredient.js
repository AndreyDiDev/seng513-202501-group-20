export default (sequelize, DataTypes) => {
    const Ingredient = sequelize.define('Ingredient', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    });
  
    Ingredient.associate = models => {
      Ingredient.belongsToMany(models.Recipe, {
        through: 'RecipeIngredient',
        foreignKey: 'ingredientId',
      });
    };
  
    return Ingredient;
  };
  