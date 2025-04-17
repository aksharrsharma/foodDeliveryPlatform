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
            res.redirect('/profile/mycart');


        } else {
            // If the order exists, check if the item is already in the order
            let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);

            if (itemIndex > -1) {
                // If item exists, increase the quantity
                order.items[itemIndex].quantity += 1;
                order.totalPrice += price;  // Update total price
                res.redirect('/profile/mycart');
                
            } else {
                // If item doesn't exist, add a new item
                order.items.push({ itemId, quantity: 1 });
                order.totalPrice += price;  // Update total price
                res.redirect('/profile/mycart');
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
    console.log(item);
    let price = item.price;

    let order = await Order.findOne({customerId:customerId});
    if(order){
        let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
        if (itemIndex > -1 && order.items[itemIndex].quantity > 0) {
            // If the order exists, check if the item is already in the order
            let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
            // If item exists, decrease the quantity
            order.items[itemIndex].quantity -= 1;
            order.totalPrice -= price;  // Update total price
            res.redirect('/profile/mycart');
            order.save();
            if(order.items[itemIndex].quantity <1){
                order.items.splice(itemIndex, 1);
            }
            
        } 
        // else if(order.items[itemIndex].quantity <1){    
        // } 
    } else{
        req.flash('error', "You have no items in cart");
        req.session.save(()=>res.redirect('back'));
    }
}

    

