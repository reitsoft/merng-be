import { AuthenticationError, UserInputError } from "apollo-server";
import Post from "../../models/Post.js";
import checkAuth from "../../utilities/checkAuth.js";
import { validatePostInput } from "../../utilities/validators.js";

export default {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(parent, { postId }, context, info) {
      try {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createPost(parent, { body }, context, info) {
      const { errors, valid } = validatePostInput(body);
      const user = checkAuth(context);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // try {
      // if (body.trim() === "") {
      //   throw new UserInputError("Post must not be empty.");
      // }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
      });

      const post = await newPost.save();
      // context.pubsub.publish("NEW_POST", { newPost: post });
      return post;
      // } catch (err) {
      //   throw new Error(err);
      // }
    },

    async deletePost(parent, { postId }, context) {
      try {
        const { username } = checkAuth(context);
        const post = await Post.findById(postId);

        if (username !== post.username) {
          throw new AuthenticationError("Action not allowed.");
        }

        await post.delete();
        return "Post deleted.";
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(parent, { postId }, context, info) {
      const post = await Post.findById(postId);
      if (!post) throw new UserInputError("Post not found.");

      const { username } = checkAuth(context);
      if (post.likes.find((like) => like.username === username)) {
        post.likes = post.likes.filter((like) => like.username !== username);
      } else {
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
        });
      }

      await post.save();
      return post;
    },
  },

  Subscription: {
    newPost: {
      subscribe(parent, args, { pubsub }, info) {
        pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};
