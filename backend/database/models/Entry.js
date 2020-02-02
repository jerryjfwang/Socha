module.exports = (sequelize, type) =>
  sequelize.define("entry", {
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
    text: type.STRING,
    question: type.STRING,
    emotion: type.INTEGER,
    sentiment: type.FLOAT,
    magnitude: type.FLOAT
  });
