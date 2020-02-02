const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const { User, GroupUser, Group } = require("../database/sequelize");

const userSchema = buildSchema(`
type Group {
    id: ID!
    name: String
    description: String
    userCount: Int
  }
  type User {
    firstName: String
    lastName: String
    phone: String
    email: String
  }
  type Query {
    user(id: ID!): User
    userGroups(userId: ID!): [Group]
  }
  type Mutation {
    createUser(firstName: String, lastName: String, phone: String, email: String) : User
  }
`);

const userRoot = {
  user: ({ id }) =>
    User.findOne({ where: { id } }).then(data => data.get({ plain: true })),
  createUser: args => User.create(args).then(data => data),
  // Should definitely figure out how to implement join/sub query functionality in GraphQL:
  userGroups: async ({ userId }) => {
    const groupUsers = await GroupUser.findAll({ where: { userId } });
    const groups = await Promise.all(
      groupUsers.map(({ groupId }) =>
        Group.findOne({ where: { id: groupId } }).then(data =>
          data.get({ plain: true })
        )
      )
    );
    return groups;
  }
};

module.exports = graphqlHTTP({
  schema: userSchema,
  rootValue: userRoot,
  graphiql: true
});
