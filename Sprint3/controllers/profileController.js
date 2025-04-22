const { name } = require('ejs');
const Item = require('../models/item');
const Order = require('../models/order'); 
const User = require('../models/user'); 




exports.displayUserCart = async (req, res)=>{
    // console.log("user "+req.session.user);
    let customerId = req.session.user;
    let order = await Order.find({customerId:customerId, status: "pending"}).populate('items.itemId', 'name price image');
    // console.log(order);
    // if(!order || order.length === 0){
    //     req.flash('error', "You have not added any cart items");
    //     req.session.save(()=>res.redirect('/items'));
    // } else{
        res.render('./profile/mycart', {order});
    // }
    
};


exports.checkout = async (req, res) =>{
    let customerId = req.session.user;    
    let order = await Order.findOne({customerId:customerId, status: "pending"}).populate('items.itemId', 'name price image');
    if(order){
        order.status = "completed";
        await order.save();
        // console.log(order);
        res.redirect('/profile/receipt');
    } else{
        req.flash('error', "No pending order found.");
        req.session.save(() => res.redirect('/profile/mycart'));
    }
};


exports.receipts = async (req, res) =>{
    let customerId = req.session.user;    
    let order = await Order.find({customerId:customerId, status: "completed"}).populate('items.itemId', 'name price image').sort({updatedAt : -1 });

    if(order.length > 0){
        res.render('profile/receipt', {order});
    } else{
        req.flash('error', "No completed orders.");
        req.session.save(() => res.redirect('/profile/mycart'));
    }
};


exports.transactions = async (req, res) =>{
    let order = await Order.find({status: "completed"}).populate('items.itemId', 'name price image').populate('customerId', 'firstName lastName').sort({updatedAt : -1 });
    // console.log(order);
    let sum = 0;
    order.forEach(item=>{
        sum +=item.totalPrice;
    })
    // if(order.length > 0){
        res.render('profile/transactions', {order, sum});
    // } else{
    //     req.flash('error', "No completed orders.");
    //     req.session.save(() => res.redirect('/profile/mycart'));
    // }
};


exports.dashboard = async (req, res) =>{
    let order = await Order.find({status: "completed"}).populate('items.itemId', 'name price image').populate('customerId', 'firstName lastName');
    // console.log(order);
    let sum = 0;
    let itemSales = {};
    let purchases = {};
    let completedOrders = {}; 

    order.forEach(order=>{
        sum +=order.totalPrice;
        
        let customer = order.customerId;
        if(customer){
            const fullName = `${customer.firstName} ${customer.lastName}`;
            if(!purchases[customer._id]){
                purchases[customer._id] = {
                    name: fullName, totalSpent: order.totalPrice, date: order.updatedAt, completedOrders: 1
                }
            } else{
                purchases[customer._id].totalSpent += order.totalPrice;
                purchases[customer._id].completedOrders += 1; // Increment completed orders count
            }
        }
        

        order.items.forEach(({itemId, quantity})=>{
            if(!itemSales[itemId._id]){
                itemSales[itemId._id] = {totalQuantity: quantity, name: itemId.name, price: itemId.price};
            } else{
                itemSales[itemId._id].totalQuantity += quantity;
            }
        });

    });

    // console.log(itemSales);

    // if(order.length > 0){
    res.render('profile/dashboard', {order, sum, itemSales, purchases});
    // } else{
    //     req.flash('error', "No completed orders.");
    //     req.session.save(() => res.redirect('/profile/mycart'));
    // }
};


exports.getFavorites = async (req, res) =>{
    let customerId = req.session.user;    
    let itemId = req.params.id;
    const user = await User.findById(customerId).populate('favorites.dishId');
    
    const order = user.favorites.map(fav => fav.dishId);
    // console.log(order);

    res.render('profile/favorites', { order });


};


// Get cart count for AJAX requests
exports.getCartCount = async (req, res) => {
    try {
        let customerId = req.session.user;
        let order = await Order.findOne({customerId: customerId, status: "pending"});
        
        if (!order || !order.items || order.items.length === 0) {
            return res.json({ count: 0 });
        }
        
        // Calculate total quantity across all items
        let count = order.items.reduce((total, item) => {
            return total + (item.quantity || 1);
        }, 0);
        
        res.json({ count });
    } catch (err) {
        console.error('Error getting cart count:', err);
        res.status(500).json({ count: 0 });
    }
};