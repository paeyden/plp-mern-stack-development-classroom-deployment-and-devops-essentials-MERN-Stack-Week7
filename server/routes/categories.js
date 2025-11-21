// category routings for CRUD operations on blog categories

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const {body, validationResult} = require('express-validator');
const Post = require('../models/Post');

// POST /api/categories - Create a new category
router.post(
  '/',
  [body('name').notEmpty().withMessage('Category name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, description } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const existing = await Category.findOne({ slug });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }

      const newCategory = new Category({ name, description, slug });
      const saved = await newCategory.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);



// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
    try {
        let categories = await Category.find().sort({createdAt: -1});
        
        // If no categories exist, create default ones
        if (categories.length === 0) {
            const defaultCategories = [
                { name: 'Technology', description: 'Posts about software, hardware, and tech trends' },
                { name: 'Lifestyle', description: 'Posts about daily life, habits, and personal experiences' },
                { name: 'Tutorial', description: 'Step-by-step guides and how-to articles' },
                { name: 'News', description: 'Current events and updates' }
            ];
            
            categories = await Category.insertMany(defaultCategories);
        }
        
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// GET /api/categories/:id/posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ category: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;