const Item = require('../models/item');
const Order = require('../models/order'); // import the item model

exports.displayUserCart = async (req, res, next) => {
    try {
        // console.log("user "+req.session.user);
        let customerId = req.session.user;
        
        // Find the order and populate the items with their details
        let order = await Order.find({customerId: customerId})
            .populate('items.itemId', 'name price image description');
        
        console.log("Cart data found:", order);
        
        if (!order || order.length === 0) {
            console.log("No order found, rendering empty cart");
            return res.render('./profile/mycart', { order: [] });
        } else {
            // Check if order has valid items before rendering
            let hasValidItems = false;
            for (const o of order) {
                if (o.items && o.items.length > 0) {
                    for (const item of o.items) {
                        if (item.itemId) {
                            hasValidItems = true;
                            break;
                        }
                    }
                }
                if (hasValidItems) break;
            }
            
            if (!hasValidItems) {
                console.log("Order exists but has no valid items");
                return res.render('./profile/mycart', { order: [] });
            }
            
            console.log("Rendering cart with items");
            return res.render('./profile/mycart', { order });
        }
    } catch (err) {
        console.error("Error displaying cart:", err);
        req.flash('error', "Error retrieving your cart");
        return res.redirect('/items');
    }
};