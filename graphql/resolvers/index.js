import postsResolvers from "./posts.js";
import usersResolvers from "./users.js";
import commentsResolvers from "./comments.js";

export default {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
