const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const { Entry, GroupUser } = require("../database/sequelize");
const getSentimentAnalysis = require("../utils/getSentimentAnalysis");

const entrySchema = buildSchema(`
  type Entry {
    userId: Int
    text: String
    emotion: String
    question: String
    sentiment: Float
    magnitude: Float
    createdAt: String
  }
  type Query {
    entries(userId: ID!): [Entry],
    entry(id: ID!) : Entry,
    groupEntries(groupId: ID!): [Entry]
  }
  type Mutation {
    createEntry(userId: Int, text: String, emotion: Int, question: String) : Entry
  }
`);

const entryRoot = {
  entries: ({ userId }) =>
    Entry.findAll({ where: { userId } }).then(data => data),
  entry: ({ id }) =>
    Entry.findOne({ where: { id } }).then(data => data.get({ plain: true })),
  createEntry: async args => {
    const { score, magnitude } = await getSentimentAnalysis(args.text);
    const data = await Entry.create({ ...args, sentiment: score, magnitude });
    return data;
  },
  groupEntries: async ({ groupId }) => {
    const groupUsers = await GroupUser.findAll({ where: { groupId } });
    const entries = await Promise.all(
      groupUsers.map(({ userId }) => Entry.findOne({ where: { userId } }))
    );
    return entries;
  }
};

module.exports = graphqlHTTP({
  schema: entrySchema,
  rootValue: entryRoot,
  graphiql: true
});
