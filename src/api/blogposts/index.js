import Express from "express";
import BlogpostModel from "./model.js";
import { sendsPostEmail } from "../../lib/email-tools.js";
import createHttpError from "http-errors";

const blogpostsRouter = Express.Router();

blogpostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogpost = new BlogpostModel(req.body);

    const { _id } = await newBlogpost.save();

    const email = req.body.author.email;
    console.log(email);
    await sendsPostEmail(email);

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const blogposts = await BlogpostModel.find();
    res.send(blogposts);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:postsId", async (req, res, next) => {
  try {
    const blogpost = await BlogpostModel.findById(req.params.postsId);
    if (blogpost) {
      res.send(blogpost);
    } else {
      next(
        createHttpError(
          404,
          `Blogpost with id ${req.params.blogpostsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put("/:postsId", async (req, res, next) => {
  try {
    const updatedPost = await BlogpostModel.findByIdAndUpdate(
      req.params.postsId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createHttpError(
          404,
          `Blogpost with the id ${req.params.postsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:postsId", async (req, res, next) => {
  try {
    const deletedPost = await BlogpostModel.findByIdAndDelete(
      req.params.blogpostsId
    );
    if (deletedPost) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
