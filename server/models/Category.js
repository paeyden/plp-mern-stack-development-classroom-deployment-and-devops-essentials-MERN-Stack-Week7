// model schema for blog categories that has a proper relation with posts

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, maxLength:[300, 'Description cannot be more than 300 characters']},
    
}, {timestamps: true});
module.exports = mongoose.model('Category', CategorySchema);