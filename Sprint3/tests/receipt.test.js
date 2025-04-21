require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); 

const User = require('../models/user');   
const Order = require('../models/order');
const Item = require('../models/item');

let mongoServer;
let agent;

describe('Order Receipt Flow', () => {
  let userCookie;
  let item;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    agent = request.agent(app);

    await agent.post('/users/register').send({
      firstName: 'User',
      lastName: 'Test',
      email: 'user@example.com',
      password: 'pass123'
    });

    const userLogin = await agent.post('/users/login').send({
      email: 'user@example.com',
      password: 'pass123'
    });

    userCookie = userLogin.headers['set-cookie'];

    item = await Item.create({
      name: 'Burger',
      price: 8,
      image: 'burger.jpg',
      description: 'Tasty burger',
      available: true
    });

    const user = await User.findOne({ email: 'user@example.com' });

    await Order.create({
      customerId: user._id,
      items: [{ itemId: item._id, quantity: 1 }],
      status: 'pending',
      totalPrice: 8
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Should complete order and show receipt', async () => {
    await agent.get('/profile/checkout').set('Cookie', userCookie);

    const res = await agent.get('/profile/receipt').set('Cookie', userCookie);

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Burger/);
    expect(res.text).toMatch(/8/);
  });
});
