const jwt = require('jsonwebtoken')
const blog = require('../models/blog')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!(decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  // const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// blogsRouter.post('/:blogId/:')

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!(decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (decodedToken.id.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'permission denied' })
  }

  const blog_id = request.params.id
  const comments = body.comments.map(comment => comment.id)

  const blog = new Blog({
    _id: blog_id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
    comments
  })

  const updatedBlog = await Blog
    .findByIdAndUpdate(blog_id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
    .populate('comments')

  response.status(201).json(updatedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  response.json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!(decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = decodedToken.id
  const blogToBeDeleted = await Blog.findById(blogId)

  if (blogToBeDeleted.user.toString() !== userId.toString()) {
    console.log(blogToBeDeleted.user.toJSON() !== userId)
    console.log(userId)
    return response.status(403).json({ error: 'invalid permission' })
  }

  await Blog.findByIdAndRemove(blogId)

  response.status(201).end()
})

module.exports = blogsRouter