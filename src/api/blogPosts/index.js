import express from "express"
import createHttpError from "http-errors"
import blogPostsModel from "./model.js"

const blogPostsRouter = express.Router()

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogPostsModel(req.body)
    const { _id } = await newBlogPost.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.find()
    res.send(blogPost)
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const user = await blogPostsModel.findById(req.params.blogPostId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
      req.params.blogPostId, 
      req.body, 
      { new: true, runValidators: true }
    )
    if (updatedBlogPost) {
      res.send(updatedBlogPost)
    } else {
      next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await blogPostsModel.findByIdAndDelete(req.params.blogPostId)
    if (deletedBlogPost) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${req.params.blogPostId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter