import dotenv from "dotenv";
import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000
const MONGO_URI = "mongodb+srv://Alex:merng-auth@reitsoftcluster.21c0o.mongodb.net/MERNG?retryWrites=true&w=majority"

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

// mongoose.set("debug", true);
mongoose.set("useFindAndModify", false);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
    server
      .listen({ port: PORT })
      .then((res) => {
        console.log(`Server on ${res.url}`);
      })
      .catch((error) => console.log(error));
  });
