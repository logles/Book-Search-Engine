import express, { Application, Request as ExpressRequest } from "express";
import path from "node:path";
import db from "./config/connection.js";
import routes from "./routes/index.js";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./schemas/resolvers.js";
import { getUserFromToken } from "./services/auth.js";

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If in production, serve static assets from the dist folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
}

// Cast routes to any to avoid type conflicts
app.use(routes as any);

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Cast req to ExpressRequest so that getUserFromToken receives the expected type
      const user = getUserFromToken(req as ExpressRequest);
      return { user };
    },
  });

  await server.start();
  // Cast app to any so that Apollo Server accepts it without type conflicts
  server.applyMiddleware({ app: app as any });
};

startApolloServer();

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
});

// import express from "express";
// import path from "node:path";
// import db from "./config/connection.js";
// import routes from "./routes/index.js";

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../dist"))); //updated from /client/build by lydia
// }

// app.use(routes);

// db.once("open", () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
