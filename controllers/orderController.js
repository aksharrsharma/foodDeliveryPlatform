const mongoose = require('mongoose');
const Item = require('../models/item');
const Order = require('../models/order');

exports.new = async (req, res) => {
  try {
    let itemId = req.params.id;
    let customerId = req.session.user;

    let item = await Item.findById(itemId);
    let price = item.price;

    let order = await Order.findOne({ customerId });

    if (!order) {
      order = new Order({
        customerId,
        items: [{ itemId, quantity: 1 }],
        totalPrice: price
      });
    } else {
      let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
      if (itemIndex > -1) {
        order.items[itemIndex].quantity += 1;
        order.totalPrice += price;
      } else {
        order.items.push({ itemId, quantity: 1 });
        order.totalPrice += price;
      }
    }

    await order.save();
    res.redirect('/profile/mycart');
  } catch (err) {
    console.log(err);
    req.flash('error', err);
    res.redirect('/items');
  }
};

exports.delete = async (req, res) => {
  const itemId = req.params.id;
  const customerId = req.session.user;

  try {
    const item = await Item.findById(itemId);
    const price = item.price;

    const order = await Order.findOne({ customerId });

    if (order) {
      const itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);

      if (itemIndex > -1 && order.items[itemIndex].quantity > 0) {
        order.items[itemIndex].quantity -= 1;
        order.totalPrice -= price;

        if (order.items[itemIndex].quantity < 1) {
          order.items.splice(itemIndex, 1);
        }

        await order.save();
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
  
