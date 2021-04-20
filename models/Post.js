import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    body: String,
    username: String,
    comments: [{ body: String, username: String, createdAt: String }],
    likes: [{ username: String, sreatedAt: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
