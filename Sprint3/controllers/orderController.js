const Item = require('../models/item');
const Order = require('../models/order'); // import the item model


//POST /items/:itemId/orders
exports.new = async(req, res) =>{
    // console.log("item "+req.params.id);
    // console.log("user "+req.session.user);

    try{
        let itemId  = req.params.id;
        let customerId = req.session.user;
        
        let item = await Item.findById(itemId)
        let price = item.price;

        let order = await Order.findOne({ customerId: customerId, status: "pending" });
        // console.log(order);
        if(!order){
            let order = new Order({
                customerId,
                items: [{itemId, quantity: 1 }],
                totalPrice: price  
            })
            await order.save()
            // console.log(order);
            res.redirect('back');


        } else {
            // If the order exists, check if the item is already in the order
            let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);

            if (itemIndex > -1) {
                // If item exists, increase the quantity
                order.items[itemIndex].quantity += 1;
                order.totalPrice += price;  // Update total price
                res.redirect('back');
                
            } else {
                // If item doesn't exist, add a new item
                order.items.push({ itemId, quantity: 1 });
                order.totalPrice += price;  // Update total price
                res.redirect('back');
            }
            await order.save()
            // console.log(order);

        }
    } catch(err){
        console.log(err);
        req.flash('error', err);
        res.redirect('/items');

    }
 
};


exports.delete = async (req, res) =>{
    // console.log("item "+req.params.id);
    // console.log("user "+req.session.user);
    let itemId  = req.params.id;
    let customerId = req.session.user;

    let item = await Item.findById(itemId)
    let price = item.price;

    let order = await Order.findOne({customerId: customerId, status: "pending"});
    console.log(order);

    if(order){
        let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
        
        if (itemIndex > -1) {
           // Decrease quantity
           order.items[itemIndex].quantity -= 1;
           order.totalPrice -= price;

           // If quantity is 0, remove the item from the array
           if (order.items[itemIndex].quantity < 1) {
               order.items.splice(itemIndex, 1);
           }

           await order.save(); 
           return res.redirect('/profile/mycart');
        } else {
            req.flash('error', 'Item not found in your cart');
            return req.session.save(() => res.redirect('/profile/mycart'));
        }
    } else {
        req.flash('error', 'You have no items in your cart');
        return req.session.save(() => res.redirect('/profile/mycart'));
    }
};

    

