import { Sequelize , DataTypes} from 'sequelize';
import UserModel from '../models/User.js'
import RecipeModel from '../models/Recipe.js';
import CommentModel from '../models/Comment.js';
import IngredientModel from '../models/Ingredient.js'


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage :'mockdb.sqlite'
})

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize, DataTypes);
db.Recipe = RecipeModel(sequelize, DataTypes);
db.Ingredient = IngredientModel(sequelize, DataTypes);
db.Comment = CommentModel(sequelize, DataTypes);

// Setup associations
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;