// mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
            quantity: { type: Number}
        }
    ],
    status: { 
        type: String, 
        enum: ["pending", "completed", "canceled"], 
        default: "pending" 
    },
    totalPrice: {type: Number, default: 0}
}, {timestamps: true} // for createdAt
);

module.exports = mongoose.model('Order', orderSchema);