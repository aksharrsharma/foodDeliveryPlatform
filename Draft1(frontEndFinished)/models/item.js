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
// const items = [
// {
//     id: '1',
//     name: "Tomato Soup",
//     price: '12.99',
//     description: 'Sun ripe tomatoes, served with bread',
//     image: '/images/tomato.jpg'
// }, 
// {
//     id: '2',
//     name: "12oz coffee",
//     price: '5.99',
//     description: 'Drip coffee made to order',
//     image: '/images/coffee.jpg'
// },
// {
//     id: '3',
//     name: "Pumpkin Pie",
//     price: '4.00',
//     description: 'One slice of pumpkin pie',
//     image: '/images/pie.jpg'
// },
// {
//     id: '4',
//     name: "Toast",
//     price: '2.99',
//     description: 'Buttered toast',
//     image: '/images/toast.jpg'
// },
// {
//     id: '5',
//     name: "Oreo Milkshake",
//     price: '5.75',
//     description: 'Hand-spinned to order',
//     image: '/images/oreo.jpg'
// }
// ];

// exports.find = function(){
//     return items;
// };

// exports.findById = function(id){
//     return items.find(item=> item.id === id);
// };