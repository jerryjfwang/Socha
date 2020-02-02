module.exports = (sequelize, type) =>
  sequelize.define("groupUser", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: type.INTEGER,
      references: {
        model: "users",
        key: "id"
      }
    },
    groupId: {
      type: type.INTEGER,
      references: {
        model: "groups",
        key: "id"
      }
    }
  });
