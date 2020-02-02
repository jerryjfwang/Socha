const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const { Group, GroupUser } = require("../database/sequelize");

const groupSchema = buildSchema(`
  type Group {
    name: String
    description: String
    userCount: Int
  }
  type GroupUser {
      userId: Int
      groupId: Int
  }
  type Query {
    group(id: ID!): Group
    sentiment(groupId: ID!, period: String): [Group]
  }
  type Mutation {
    createGroup(name: String, description: String) : Group
    joinGroup(userId: ID!, groupId: ID!) : GroupUser
  }
`);

const groupRoot = {
  group: ({ id }) =>
    Group.findOne({ where: { id } }).then(data => data.get({ plain: true })),
  createGroup: args =>
    Group.create({ ...args, userCount: 1 }).then(data => data),
  joinGroup: args => {
    Group.increment("userCount", { where: { id: args.groupId } });
    GroupUser.create(args).then(data => data);
  }
};

module.exports = graphqlHTTP({
  schema: groupSchema,
  rootValue: groupRoot,
  graphiql: true
});
