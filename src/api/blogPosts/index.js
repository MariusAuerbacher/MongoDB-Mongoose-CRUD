import express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "../authors/model.js";
import blogPostsModel from "../blogPosts/model.js"

const blogPostsRouter = express.Router();

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const { authorId, ...blogPostModel } = req.body;
    const author = await AuthorsModel.findById(authorId);
    if (!author) {
      return next(
        createHttpError(404, `Author with id ${authorId} not found!`)
      );
    }
    const newBlogPost = new blogPostsModel(req.body);
    const { _id } = await newBlogPost.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel
      .find()
      .skip(req.query.skip)
      .limit(req.query.limit)
      .populate("author");
    res.send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const user = await blogPostsModel.findById(req.params.blogPostId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(
          404,
          `Blog Post with id ${req.params.blogPostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
      req.params.blogPostId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(
        createHttpError(
          404,
          `Blog Post with id ${req.params.blogPostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await blogPostsModel.findByIdAndDelete(
      req.params.blogPostId
    );
    if (deletedBlogPost) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogPostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/:id", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.id);
    blogPost.comments.push(req.body);
    await blogPost.save();
    res.send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel
      .findById(req.params.id)
      .select("comments -_id");

    res.send(blogPost);
    //res.send(blogPost.comments)
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.id);
    const comment = blogPost.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (comment) {
      res.send(comment);
    } else {
      next(
        createHttpError(
          404,
          `Comment with id ${req.params.commentId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.id);
    const comment = blogPost.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    comment.text = req.body.text;
    await blogPost.save();
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.id);
    blogPost.comments = blogPost.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId
    );

    await blogPost.save();
    res.send("Comment successfully delete");
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
