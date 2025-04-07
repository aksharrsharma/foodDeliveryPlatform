require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Item = require('../models/item');
const Order = require('../models/order');

const agent = request.agent(app);

let userId;
let itemId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  await User.deleteMany();
  await Item.deleteMany();
  await Order.deleteMany();

  const user = await User.create({
    firstName: 'Cart',
    lastName: 'User',
    username: 'cartuser',
    email: 'cart@example.com',
    password: 'password123',
  });

  const item = await Item.create({
    name: 'Fries',
    price: 3.99,
    description: 'Golden crispy fries',
    image: '/images/fries.jpg',
  });

  userId = user._id;
  itemId = item._id;

  await agent
    .post('/users/login')
    .send({ email: 'cart@example.com', password: 'password123' });

  await Order.create({
    customerId: userId,
    items: [{ itemId: itemId, quantity: 2 }],
    totalPrice: 7.98,
  });
});

afterAll(async () => {
  await User.deleteMany();
  await Item.deleteMany();
  await Order.deleteMany();
  await mongoose.connection.close();
});

describe('DELETE /items/:id/orders - Remove from Cart', () => {
  test('Removes item from cart if user is logged in', async () => {
    const res = await agent.delete(`/items/${itemId}/orders`);
    expect(res.statusCode).toBe(302);

    const updatedOrder = await Order.findOne({ customerId: userId });
    expect(updatedOrder.items.length).toBe(0);
  });

  test('Redirects unauthenticated user to login', async () => {
    const res = await request(app).delete(`/items/${itemId}/orders`);
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/\/users\/login/);
  });
});
