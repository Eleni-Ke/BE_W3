import Express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "./model.js";
// import uniqid from "uniqid";
// import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const authorsRouter = Express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    console.log(newAuthor);
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorsId", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorsId);
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(
          404,
          `Author with the id: ${req.params.authorsId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorsId", async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
      req.params.authorsId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(
        createError(404, `Author with id ${req.params.authorsId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorsId", async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorsModel.findByIdAndDelete(
      req.params.authorsId
    );
    if (deletedAuthor) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Author with id ${req.params.authorsId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
