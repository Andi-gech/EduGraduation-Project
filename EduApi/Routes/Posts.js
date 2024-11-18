const express = require("express");
const Router = express.Router();
const { Post, validatePost } = require("../Model/Posts");
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const upload = require("../utils/multerConfig");

const { roleAuth } = require("../MiddleWare/RoleAuth");
/**
 * @swagger
 * /post/:
 *   post:
 *     summary: Create a new post with an image
 *     description: This endpoint allows authenticated users to create a new post that includes content and an image. The image is uploaded as a multipart form-data request.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is my new post content."
 *               Image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b56"
 *                 content:
 *                   type: string
 *                   example: "This is my new post content."
 *                 user:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b50"
 *                 image:
 *                   type: string
 *                   example: "/uploads/images/example.jpg"
 *       400:
 *         description: Bad request, invalid input or missing image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.post(
  "/",
  AuthMiddleware,

  upload.single("Image"),
  async (req, res) => {
    try {
      const { error } = validatePost(req.body);
      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).send("No file uploaded");
      }

      req.body.image = uploadedFile.path;
      console.log(req.body.image);

      if (error) return res.status(400).send(error.details[0].message);
      const post = new Post({
        content: req.body.content,
        user: req.user.userid,
        image: req.body.image,
      });
      await post.save();
      return res.send(post);
    } catch (err) {
      res.status(500).send(err.message || "Something went wrong");
    }
  }
);
/**
 * @swagger
 * /post/:
 *   get:
 *     summary: Retrieve posts not viewed by the user
 *     description: This endpoint retrieves posts that the authenticated user has not viewed. It excludes any posts the user has already seen and returns them sorted by date in descending order.
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     responses:
 *       200:
 *         description: A list of posts not viewed by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b56"
 *                   content:
 *                     type: string
 *                     example: "This is a sample post."
 *                   user:
 *                     type: object
 *                     properties:
 *                       profilePic:
 *                         type: string
 *                         example: "/uploads/profilePics/user.jpg"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-01T10:00:00.000Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.get("/", AuthMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({
      Viwers: { $ne: req.user._id },
    })
      .populate("user", "profilePic firstName lastName")
      .sort("-date");
    return res.send(posts);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /post/viewer/{id}:
 *   put:
 *     summary: Mark a post as viewed
 *     description: This endpoint allows authenticated users to mark a post as viewed. Users can only view a post once.
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to mark as viewed.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1e8c001f8d4b58"
 *     responses:
 *       200:
 *         description: Post marked as viewed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b58"
 *                 content:
 *                   type: string
 *                   example: "This is an example post content."
 *                 user:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b59"
 *                 Viwers:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b58"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */

Router.put("/viewer/:id", AuthMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send("Post not found");
    if (post.Viwers.includes(req.user._id))
      return res.status(400).send("Already viewed");
    post.Viwers.push(req.user._id);
    await post.save();
    return res.send(post);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});
/**
 * @swagger
 * /post/like/{id}:
 *   put:
 *     summary: Like a post
 *     description: This endpoint allows an authenticated user to like a specific post. If the user has already liked the post, an error message will be returned.
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to like.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1e8c001f8d4b56"
 *     responses:
 *       200:
 *         description: The post was liked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b56"
 *                 likedBy:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b57"
 *                 content:
 *                   type: string
 *                   example: "This is a sample post."
 *                 user:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: string
 *                       example: "/uploads/profilePics/user.jpg"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T10:00:00.000Z"
 *       400:
 *         description: Invalid request, post not found, or already liked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Post not found"  # or "Already liked"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.put("/like/:id", AuthMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send("Post not found");
    if (post.likedBy.includes(req.user._id))
      return res.status(400).send("Already liked");
    post.likedBy.push(req.user._id);
    await post.save();
    return res.send(post);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /post/unlike/{id}:
 *   put:
 *     summary: Unlike a post
 *     description: This endpoint allows an authenticated user to unlike a specific post. If the user has not liked the post yet, an error message will be returned.
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []  # Assuming you're using Bearer token for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to unlike.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1e8c001f8d4b56"
 *     responses:
 *       200:
 *         description: The post was unliked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1e8c001f8d4b56"
 *                 likedBy:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "60c72b2f9b1e8c001f8d4b57"
 *                 content:
 *                   type: string
 *                   example: "This is a sample post."
 *                 user:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: string
 *                       example: "/uploads/profilePics/user.jpg"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T10:00:00.000Z"
 *       400:
 *         description: Invalid request, post not found, or not liked yet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Post not found"  # or "Not liked yet"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
Router.put("/unlike/:id", AuthMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send("Post not found");
    if (!post.likedBy.includes(req.user._id))
      return res.status(400).send("Not liked yet");
    post.likedBy = post.likedBy.filter((id) => id != req.user._id);
    await post.save();
    return res.send(post);
  } catch (err) {
    res.status(500).send(err.message || "Something went wrong");
  }
});

module.exports = Router;
