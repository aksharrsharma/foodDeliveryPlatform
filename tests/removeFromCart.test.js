const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const Item = require('../models/item');
const Order = require('../models/order');

let userSession;
let userId;
let itemId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
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
  });
});

afterAll(async () => {
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
  });
});
