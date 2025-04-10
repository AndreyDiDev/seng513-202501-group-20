import { Sequelize , DataTypes} from 'sequelize';
import UserModel from '../models/User.js'


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage :'mockdb.sqlite'
})

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize, DataTypes);

// Object.values(db).forEach(model => {
//     if (model.associate) {
//       model.associate(db);
//     }
//   });
await sequelize.sync({force: true})

export default db;

  
// Below checks for succesful connection and for now it works for me
// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }