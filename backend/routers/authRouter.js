const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const { User } = require("../database/sequelize");

const authSchema = buildSchema(`
  type User {
    firstName: String
    lastName: String
    phone: String
    email: String
  }
  type Query {
    login(email: String, password: String): Boolean
  }
`);

const authRoot = {
  login: ({ email, password }) =>
    User.findOne({ where: { email } }).then(data => (data ? true : false))
};

module.exports = graphqlHTTP({
  schema: authSchema,
  rootValue: authRoot,
  graphiql: true
});
