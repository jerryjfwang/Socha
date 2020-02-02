const Sequelize = require("sequelize");
const EntryModel = require("./models/Entry");
const UserModel = require("./models/User");
const GroupModel = require("./models/Group");
const GroupUserModel = require("./models/GroupUser");
const sequelize = new Sequelize("20hacksc", "root", "password", {
  dialect: "mysql",

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
const Entry = EntryModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Group = GroupModel(sequelize, Sequelize);
const GroupUser = GroupUserModel(sequelize, Sequelize);

User.hasMany(Entry);
Entry.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Group, { through: "groupUser" });
Group.belongsToMany(User, { through: "groupUser" });

sequelize.query("SET FOREIGN_KEY_CHECKS = 0").then(() =>
  sequelize.sync({ force: false }).then(() => {
    console.log(`Database & tables created here!`);
  })
);

module.exports = {
  Entry,
  User,
  Group,
  GroupUser
};
