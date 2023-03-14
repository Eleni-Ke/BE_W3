import Express from "express";
import uniqid from "uniqid";
import {
  checkCommentSchema,
  triggerBadRequest,
} from "../blogposts/blogpostSchema.js";
import { getComments, writeComments } from "../../lib/fs-tools.js";

const commentsRouter = Express.Router();

commentsRouter.post(
  "/:blogpostsId/comments",
  checkCommentSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const postId = req.params.blogpostsId;
      const newComment = {
        ...req.body,
        id: uniqid(),
        postId: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const allComments = await getComments();
      allComments.push(newComment);
      await writeComments(allComments);

      res.status(201).send({ id: newComment.id });
    } catch (error) {
      next(error);
    }
  }
);

commentsRouter.get("/:blogpostsId/comments", async (req, res, next) => {
  try {
    const postId = req.params.blogpostsId;
    const allComments = await getComments();
    const matchedComments = allComments.filter((e) => e.postId === postId);
    res.send(matchedComments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.put(
  "/:blogpostsId/comments/commentsId",
  checkCommentSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const commentId = req.params.commentsId;
      const allComments = await getComments();
      const index = allComments.findIndex((e) => e.id === commentId);
      const oldComment = allComments[index];
      const updatedComment = {
        ...oldComment,
        ...req.body,
        updatedAt: new Date(),
      };
      allComments[index] = updatedComment;
      await writeComments(allComments);
      res.send(updatedComment);
    } catch (error) {
      next(error);
    }
  }
);

commentsRouter.delete(
  "/:blogpostsId/comments/commentsId",
  async (req, res, next) => {
    try {
      const commentId = req.params.commentsId;
      const allComments = await getComments();
      const remainingComments = allComments.filter((e) => e.id !== commentId);
      await writeComments(remainingComments);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default commentsRouter;
