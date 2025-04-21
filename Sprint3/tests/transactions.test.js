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

describe('Admin Transaction View', () => {
  let adminCookie;
  let item;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    agent = request.agent(app);

    await agent.post('/users/register').send({
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@example.com',
      password: 'pass123',
      admin: 'admin'
    });

    const adminLogin = await agent.post('/users/login').send({
      email: 'admin@example.com',
      password: 'pass123'
    });

    adminCookie = adminLogin.headers['set-cookie'];

    item = await Item.create({
      name: 'Salad',
      price: 7,
      description: 'Fresh salad',
      image: 'salad.jpg',
      available: true
    });

    const adminUser = await User.findOne({ email: 'admin@example.com' });

    await Order.create({
      customerId: adminUser._id,
      items: [{ itemId: item._id, quantity: 1 }],
      status: 'completed',
      totalPrice: 7
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Admin should view completed transactions', async () => {
    const res = await agent.get('/profile/transactions').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Salad/);
    expect(res.text).toMatch(/7/);
  });
});
