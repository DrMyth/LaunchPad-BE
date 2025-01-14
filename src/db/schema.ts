import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    id: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const startupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    views: { type: Number, default: 1 },
    description: { type: String },
    category: {
      type: String,
      required: true,
    },
    date: { type: Date, default: Date.now },
    image: { type: String, required: true },
    pitch: { type: String },
  },
  { timestamps: true }
);

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    select: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Startup",
      },
    ],
  }
);


const Startup = mongoose.model("Startup", startupSchema);
const Author = mongoose.model("Author", authorSchema);
const Playlist = mongoose.model("Playlist", playlistSchema);

export { Startup, Author, Playlist };