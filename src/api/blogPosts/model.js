import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    author: [{
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true
     }],
    content: [String],
    comments: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("blogPost", blogPostsSchema);
