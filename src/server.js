import Express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import { badRequestHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"
import blogPostsRouter from "./api/blogPosts/index.js";
import authorsRouter from "./api/authors/index.js";

const server = Express()
const port = process.env.PORT || 3001


server.use(cors())
server.use(Express.json())

server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)



server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})