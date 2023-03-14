import Express from "express";
import uniqid from "uniqid";
import { checkBlogpostsSchema, triggerBadRequest } from "./blogpostSchema.js";
import {
  getAuthors,
  getBlogposts,
  writeBlogposts,
} from "../../lib/fs-tools.js";
import { sendsPostEmail } from "../../lib/email-tools.js";

const blogpostsRouter = Express.Router();

blogpostsRouter.post(
  "/",
  checkBlogpostsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newBlogpost = {
        ...req.body,
        id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const allBlogposts = await getBlogposts();
      allBlogposts.push(newBlogpost);
      await writeBlogposts(allBlogposts);
      const email = req.body.author.email;
      console.log(email);
      // const authorName = req.body.author.name;
      // const allAuthors = await getAuthors();
      // const matchedAuthor = allAuthors.find((e) => e.name === authorName);
      // if (matchedAuthor) {
      //   console.log(matchedAuthor);
      //   const email = matchedAuthor.email;
      //   console.log(email);
      //   await sendsPostEmail(email);
      // } else {
      //   console.log("Author does not exist.");
      // }
      await sendsPostEmail(email);

      res.status(201).send({ id: newBlogpost.id });
    } catch (error) {
      next(error);
    }
  }
);

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const allBlogposts = await getBlogposts();
    if (req.query && req.query.title) {
      const matchedBlogposts = allBlogposts.filter((post) =>
        post.title.toLowerCase().includes(req.query.title.toLocaleLowerCase())
      );
      res.send(matchedBlogposts);
    } else {
      res.send(allBlogposts);
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:postsId", async (req, res, next) => {
  try {
    const postId = req.params.postsId;
    const allBlogposts = await getBlogposts();
    const post = allBlogposts.find((e) => e.id === postId);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put(
  "/:postsId",
  checkBlogpostsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const postId = req.params.postsId;
      const allBlogposts = await getBlogposts();
      const index = allBlogposts.findIndex((e) => e.id === postId);
      const oldPost = allBlogposts[index];
      const updatedPost = {
        ...oldPost,
        ...req.body,
        updatedAt: new Date(),
      };
      allBlogposts[index] = updatedPost;
      await writeBlogposts(allBlogposts);
      res.send(updatedPost);
    } catch (error) {
      next(error);
    }
  }
);

blogpostsRouter.delete("/:postsId", async (req, res, next) => {
  try {
    const postId = req.params.postsId;
    const allBlogposts = await getBlogposts;
    const remainingPosts = allBlogposts.filter((e) => e.id !== postId);
    await writeBlogposts(remainingPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
