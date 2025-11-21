// routes for making posts
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const {body, validationResult} = require('express-validator');
const Category = require('../models/Category');
const User = require('../models/User');

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Validation middleware
const validatePost = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('category')
    .isMongoId().withMessage('Valid category ID required')
];


// GET /api/posts - Get all blog posts with pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, tags } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// get a specific post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('category').populate('author');
        if(!post){
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        
    }
});



// POST /api/posts - Create a new blog post
router.post('/', validatePost, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { title, content, category } = req.body;
        
        // Get user from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No authentication token provided' });
        }
        
        // Decode token to get user ID (assuming JWT)
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        const authorId = decoded.userId;

        // Validate category existence
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ success: false, message: 'Invalid category' });
        }

        // Generate slug from title with a timestamp to ensure uniqueness
        const timestamp = Date.now().toString(36);
        const slug = `${generateSlug(title)}-${timestamp}`;

        // Create excerpt from content if not provided
        const excerpt = content.substring(0, 150) + '...';

        const newPost = new Post({
            title,
            content,
            category,
            author: authorId,
            slug,
            excerpt,
            isPublished: true
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        
    }
});

// update an existing post by id
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updatedPost){
            return res.status(404).json({ success: false, message: 'Post not found' });
        }   
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message }); 
    }
});




// DELETE /api/posts/:id - Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;


