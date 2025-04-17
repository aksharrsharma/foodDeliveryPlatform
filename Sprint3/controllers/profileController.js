const { name } = require('ejs');
const Item = require('../models/item');
const Order = require('../models/order'); // import the item model



exports.displayUserCart = async (req, res)=>{
    // console.log("user "+req.session.user);
    let customerId = req.session.user;
    let order = await Order.find({customerId:customerId, status: "pending"}).populate('items.itemId', 'name price image');
    console.log(order);
    if(!order || order.length === 0){
        req.flash('error', "You have not added any cart items");
        req.session.save(()=>res.redirect('/items'));
    } else{
        res.render('./profile/mycart', {order});
    }
    
};


exports.checkout = async (req, res) =>{
    let customerId = req.session.user;    
    let order = await Order.findOne({customerId:customerId, status: "pending"}).populate('items.itemId', 'name price image');
    if(order){
        order.status = "completed";
        await order.save();
        console.log(order);
        res.redirect('/profile/receipt');
    } else{
        req.flash('error', "No pending order found.");
        req.session.save(() => res.redirect('/profile/mycart'));
    }
};

exports.receipts = async (req, res) =>{
    let customerId = req.session.user;    
    let order = await Order.find({customerId:customerId, status: "completed"}).populate('items.itemId', 'name price image');
    if(order.length > 0){
        res.render('profile/receipt', {order});
    } else{
        req.flash('error', "No completed orders.");
        req.session.save(() => res.redirect('/profile/mycart'));
    }
}

exports.transactions = async (req, res) =>{
    let order = await Order.find({status: "completed"}).populate('items.itemId', 'name price image').populate('customerId', 'firstName lastName');
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
}

exports.dashboard = async (req, res) =>{
    let order = await Order.find({status: "completed"}).populate('items.itemId', 'name price image').populate('customerId', 'firstName lastName');
    // console.log(order);
    let sum = 0;
    let itemSales = {};
    let purchases = {};
    order.forEach(order=>{
        sum +=order.totalPrice;
        
        let customer = order.customerId;
        if(customer){
            const fullName = `${customer.firstName} ${customer.lastName}`;
            if(!purchases[customer._id]){
                purchases[customer._id] = {
                    name: fullName, totalSpent: order.totalPrice
                }
            } else{
                purchases[customer._id].totalSpent += order.totalPrice;
            }
        }
        

        order.items.forEach(({itemId, quantity})=>{
            if(!itemSales[itemId._id]){
                itemSales[itemId._id] = {totalQuantity: quantity, name: itemId.name};
            } else{
                itemSales[itemId._id].totalQuantity += quantity;
            }
        });

    });

    console.log(itemSales);

    // if(order.length > 0){
        res.render('profile/dashboard', {order, sum, itemSales, purchases});
    // } else{
    //     req.flash('error', "No completed orders.");
    //     req.session.save(() => res.redirect('/profile/mycart'));
    // }
}

