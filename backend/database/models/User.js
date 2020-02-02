module.exports = (sequelize, type) =>
  sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    phone: type.STRING,
    email: type.STRING
  });
