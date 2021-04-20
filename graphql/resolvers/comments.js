import { AuthenticationError, UserInputError } from "apollo-server";
import Post from "../../models/Post.js";
import checkAuth from "../../utilities/checkAuth.js";

export default {
  Mutation: {
    async createComment(parent, { postId, body }, context, info) {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comment.", {
          errors: {
            body: "Comment must not be empty.",
          },
        });
      }

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found.");
      post.comments.unshift({
        body,
        username,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      return post;
    },
    async deleteComment(parent, { postId, commentId }, context, info) {
      const post = await Post.findById(postId);
      if (!post) throw new UserInputError("Post not found.");

      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      const { username } = checkAuth(context);
      if (post.comments[commentIndex].username !== username) {
        throw new AuthenticationError("Action not allowed.");
      }

      post.comments.splice(commentIndex, 1);
      await post.save();
      return post;
    },
  },
};
