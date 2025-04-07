const Item = require('../models/item');
const Order = require('../models/order'); 



exports.displayUserCart = async (req, res)=>{
    let customerId = req.session.user;
    let order = await Order.find({customerId:customerId}).populate('items.itemId', 'name price image');
    console.log(order);
    if(!order){
        req.flash('error', "You have not added any cart items");
        req.session.save(()=>res.redirect('back'));
    } else{
        res.render('./profile/mycart', {order});
    }
    
}
