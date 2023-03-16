import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogpostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: {
        type: String,
        required: true,
        validate: {
          validator: function (unit) {
            return ["seconds", "minutes", "hours"].includes(unit);
          },
          message: "Unit must be one of 'seconds', 'minutes', or 'hours'",
        },
      },
    },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    content: { type: String, required: true },
    likes: [{ type: String }],
    comments: [
      {
        name: String,
        comment: String,
        commentCreatedAt: Date,
        commentUpdatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default model("Blogpost", blogpostsSchema);
