<<<<<<< HEAD
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
=======
require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
const User = require('../models/user');
const Item = require('../models/item');
const Order = require('../models/order');

<<<<<<< HEAD
let userSession;
=======
const agent = request.agent(app);

>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
let userId;
let itemId;

beforeAll(async () => {
<<<<<<< HEAD
  await mongoose.connect(process.env.MONGO_URL);
=======
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
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

<<<<<<< HEAD
  userId = user._id;

  const loginRes = await request(app)
    .post('/users/login')
    .send({ email: 'cart@example.com', password: 'password123' });

  userSession = loginRes.headers['set-cookie'];

  const item = await Item.create({
    name: 'Fries',
    description: 'Crispy golden fries',
    price: 2.99,
  });

  itemId = item._id;

  await Order.create({
    customerId: userId,
    items: [{ itemId: itemId, quantity: 1 }],
    totalPrice: 2.99,
=======
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
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
  });
});

afterAll(async () => {
<<<<<<< HEAD
  await mongoose.connection.close();
});

describe('Remove Item from Cart', () => {
  test('User can remove item from cart', async () => {
    await request(app)
  .delete(`/items/${itemId}/orders?_method=DELETE`)
  .set('Cookie', userSession);


await new Promise(resolve => setTimeout(resolve, 300));

const order = await Order.findOne({ customerId: userId });
const mongoose = require('mongoose'); 
const foundItem = order?.items.find(i => i.itemId.equals(new mongoose.Types.ObjectId(itemId)));
expect(foundItem).toBeUndefined();

  });

  test('Unauthenticated user is redirected to login', async () => {
    const res = await request(app).delete(`/items/${itemId}/orders?_method=DELETE`);
    expect(res.statusCode).toBe(302);
    expect(res.headers['location']).toMatch(/login/);
=======
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
>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
  });
});
