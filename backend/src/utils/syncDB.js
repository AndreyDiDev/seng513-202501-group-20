// Only run this once
//use node sync.js. These are not AI comments. Zaid wrote this
import db from "../db/db.js";

db.sequelize.sync({ force: true }).then(() => {
  console.log("Database synced ✅");
  process.exit();
});
