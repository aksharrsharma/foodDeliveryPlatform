// mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    name: {type: String, required: [true, 'A Title is required']},
    price: {type: Number, required: [true, 'Price is required'], min: 0.01, max: 1000000},
    description: {type: String, required: [true, 'Description is required'], minlength:'10'},
    image: {type: String}, 
    active: {type: Boolean, default: true}
}, {timestamps: true} // for createdAt
);



module.exports = mongoose.model('Item', itemsSchema);