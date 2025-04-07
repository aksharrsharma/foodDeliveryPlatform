const Item = require('../models/item');
const Order = require('../models/order');


const newOrder = async (req, res) => {
  try {
    let itemId = req.params.id;
    let customerId = req.session.user;

    let item = await Item.findById(itemId);
    let price = item.price;

    let order = await Order.findOne({ customerId: customerId });
    if (!order) {
      order = new Order({
        customerId,
        items: [{ itemId, quantity: 1 }],
        totalPrice: price
      });
      await order.save();
      console.log(order);
      res.redirect('/profile/mycart');
    } else {
      let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);

      if (itemIndex > -1) {
        order.items[itemIndex].quantity += 1;
        order.totalPrice += price;
      } else {
        order.items.push({ itemId, quantity: 1 });
        order.totalPrice += price;
      }

      await order.save();
      console.log(order);
      res.redirect('/profile/mycart');
    }
  } catch (err) {
    console.log(err);
    req.flash('error', err.message || 'An error occurred.');
    res.redirect('/items');
  }
};


const deleteOrder = async (req, res) => {
  try {
    let itemId = req.params.id;
    let customerId = req.session.user;

    let item = await Item.findById(itemId);
    let price = item.price;

    let order = await Order.findOne({ customerId: customerId });
    if (order) {
      let itemIndex = order.items.findIndex(i => i.itemId.toString() === itemId);
      if (itemIndex > -1 && order.items[itemIndex].quantity > 0) {
        order.items[itemIndex].quantity -= 1;
        order.totalPrice -= price;

        if (order.items[itemIndex].quantity < 1) {
          order.items.splice(itemIndex, 1);
        }

        await order.save();
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
