<<<<<<< HEAD
const mongoose = require('mongoose');
const Item = require('../models/item');
const Order = require('../models/order');

exports.new = async (req, res) => {
=======
const Item = require('../models/item');
const Order = require('../models/order');


const newOrder = async (req, res) => {
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
  try {
    let itemId = req.params.id;
    let customerId = req.session.user;

    let item = await Item.findById(itemId);
    let price = item.price;

<<<<<<< HEAD
    let order = await Order.findOne({ customerId });

=======
    let order = await Order.findOne({ customerId: customerId });
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
    if (!order) {
      order = new Order({
        customerId,
        items: [{ itemId, quantity: 1 }],
        totalPrice: price
      });
<<<<<<< HEAD
    } else {
      let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
=======
      await order.save();
      console.log(order);
      res.redirect('/profile/mycart');
    } else {
      let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);

>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
      if (itemIndex > -1) {
        order.items[itemIndex].quantity += 1;
        order.totalPrice += price;
      } else {
        order.items.push({ itemId, quantity: 1 });
        order.totalPrice += price;
      }
<<<<<<< HEAD
    }

    await order.save();
    res.redirect('/profile/mycart');
  } catch (err) {
    console.log(err);
    req.flash('error', err);
=======

      await order.save();
      console.log(order);
      res.redirect('/profile/mycart');
    }
  } catch (err) {
    console.log(err);
    req.flash('error', err.message || 'An error occurred.');
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
    res.redirect('/items');
  }
};

<<<<<<< HEAD
exports.delete = async (req, res) => {
  const itemId = req.params.id;
  const customerId = req.session.user;

  try {
    const item = await Item.findById(itemId);
    const price = item.price;

    const order = await Order.findOne({ customerId });

    if (order) {
      const itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);

=======

const deleteOrder = async (req, res) => {
  try {
    let itemId = req.params.id;
    let customerId = req.session.user;

    let item = await Item.findById(itemId);
    let price = item.price;

    let order = await Order.findOne({ customerId: customerId });
    if (order) {
      let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
      if (itemIndex > -1 && order.items[itemIndex].quantity > 0) {
        order.items[itemIndex].quantity -= 1;
        order.totalPrice -= price;

        if (order.items[itemIndex].quantity < 1) {
          order.items.splice(itemIndex, 1);
        }

        await order.save();
<<<<<<< HEAD
        return res.redirect('/profile/mycart');
      }
    } else {
      req.flash('error', 'You have no items in cart');
      return req.session.save(() => res.redirect('back'));
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    return req.session.save(() => res.redirect('back'));
  }
};

exports.viewCart = async (req, res, next) => {
  try {
    const customerId = req.session.user;

    const order = await Order.findOne({ customerId }).populate('items.itemId');

    if (!order || order.items.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.render('cart', { cartItems: [], total: 0 });
    }

    const cartItems = order.items.map(entry => ({
      item: entry.itemId,
      quantity: entry.quantity,
      subtotal: entry.quantity * entry.itemId.price
    }));

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.render('cart', { cartItems, total });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


exports.removeFromCart = async (req, res, next) => {
    try {
      const userId = req.session.user;
      const itemId = new mongoose.Types.ObjectId(req.params.id);
  
      const order = await Order.findOne({ customerId: userId });
  
      if (!order) {
        req.flash('error', 'No order found');
        return res.redirect('/profile/mycart');
      }
  
      const initialLength = order.items.length;
      order.items = order.items.filter(i => !i.itemId.equals(itemId));
      if (order.items.length < initialLength) {
        
        order.totalPrice = order.items.reduce((sum, i) => sum + (i.quantity * 2.99), 0); // Adjust if dynamic price
        await order.save();
      }
  
      req.flash('success', 'Item removed from cart');
      res.redirect('/profile/mycart');
    } catch (err) {
      next(err);
    }
  };
  
=======
        res.redirect('/profile/mycart');
      } else {
        res.redirect('/profile/mycart');
      }
    } else {
      req.flash('error', "You have no items in cart");
      req.session.save(() => res.redirect('back'));
    }
  } catch (err) {
    console.log(err);
    req.flash('error', err.message || 'An error occurred.');
    res.redirect('/items');
  }
};


const viewCart = async (req, res) => {
  try {
    const customerId = req.session.user;
    const order = await Order.findOne({ customerId }).populate('items.itemId');

    if (!order || order.items.length === 0) {
      return res.render('cart', { cartItems: [], totalPrice: 0 });
    }

    res.render('cart', {
      cartItems: order.items,
      totalPrice: order.totalPrice,
    });
  } catch (err) {
    console.log(err);
    req.flash('error', err.message || 'Failed to load cart');
    res.redirect('/items');
  }
};

module.exports = {
  newOrder,
  deleteOrder,
  viewCart
};
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
