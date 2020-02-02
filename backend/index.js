const express = require("express");
const userRouter = require("./routers/userRouter");
const entryRouter = require("./routers/entryRouter");
const authRouter = require("./routers/authRouter");
const groupRouter = require("./routers/groupRouter");

const app = express();
// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true
//   })
// );

app.use("/users", userRouter);
app.use("/entries", entryRouter);
app.use("/auth", authRouter);
app.use("/groups", groupRouter);

app.listen(3000);

console.log("Running a GraphQL API server at localhost:3000/graphql");
