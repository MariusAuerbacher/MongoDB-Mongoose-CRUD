import mongoose from "mongoose"

const { Schema, model } = mongoose

const authorsSchema = new Schema(
  {
    author: { type: String, required: true },
  },
  { timestamps: true }
)

export default model("Author", authorsSchema)