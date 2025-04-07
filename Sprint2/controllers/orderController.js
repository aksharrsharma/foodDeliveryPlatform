const Item = require('../models/item');
const Order = require('../models/order');

exports.new = async(req, res) => {
    try {
        let itemId = req.params.id;
        let customerId = req.session.user;
        
        // Get quantity from request body or default to 1
        let quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;
        
        let item = await Item.findById(itemId);
        if (!item) {
            req.flash('error', 'Item not found');
            return res.redirect('/items');
        }
        
        let price = item.price;
        
        let order = await Order.findOne({customerId: customerId});
        if (!order) {
            // Create new order if none exists
            order = new Order({
                customerId,
                items: [{itemId, quantity: quantity}],
                totalPrice: price * quantity  
            });
        } else {
            // Check if item already exists in order
            const existingItemIndex = order.items.findIndex(
                i => i.itemId.toString() === itemId.toString()
            );
            
            if (existingItemIndex > -1) {
                // Update quantity if item exists
                order.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item if it doesn't exist
                order.items.push({itemId, quantity: quantity});
            }
            
            // Recalculate total price
            order.totalPrice = await calculateOrderTotal(order);
        }
        
        await order.save();
        return res.status(200).json({ success: true });
    } catch(err) {
        console.error('Error adding to cart:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.delete = async(req, res) => {
    try {
        let itemId = req.params.id;
        let customerId = req.session.user;
        
        let item = await Item.findById(itemId);
        if (!item) {
            req.flash('error', 'Item not found');
            return res.redirect('/profile/mycart');
        }
        
        let price = item.price;
        
        let order = await Order.findOne({customerId: customerId});
        if (!order) {
            req.flash('error', 'No items in cart');
            return res.redirect('/profile/mycart');
        }
        
        // Find the item in the order
        const itemIndex = order.items.findIndex(
            i => i.itemId.toString() === itemId.toString()
        );
        
        if (itemIndex > -1) {
            if (order.items[itemIndex].quantity > 1) {
                // Decrease quantity if more than 1
                order.items[itemIndex].quantity -= 1;
            } else {
                // Remove item if quantity is 1
                order.items.splice(itemIndex, 1);
            }
            
            // Recalculate total price
            order.totalPrice = await calculateOrderTotal(order);
            await order.save();
        }
        
        return res.redirect('/profile/mycart');
    } catch(err) {
        console.error('Error removing from cart:', err);
        req.flash('error', 'Error removing item from cart');
        return res.redirect('/profile/mycart');
    }
};

// Helper function to calculate order total
async function calculateOrderTotal(order) {
    let total = 0;
    for (const item of order.items) {
        const productItem = await Item.findById(item.itemId);
        if (productItem) {
            total += productItem.price * item.quantity;
        }
    }
    return total;
}