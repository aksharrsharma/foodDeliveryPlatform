require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); 

const User = require('../models/user');
const Order = require('../models/order');

let mongoServer;
let agent;

describe('Admin Dashboard', () => {
  let adminCookie, userCookie;

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

    const user = await User.findOne({ email: 'user@example.com' });

    await Order.create([
      {
        customerId: user._id,
        items: [{ itemId: new mongoose.Types.ObjectId(), quantity: 2 }],
        status: 'completed',
        totalPrice: 10
      },
      {
        customerId: user._id,
        items: [{ itemId: new mongoose.Types.ObjectId(), quantity: 1 }],
        status: 'completed',
        totalPrice: 15
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Non-admin should NOT access dashboard', async () => {
    const res = await agent.get('/admin/dashboard').set('Cookie', userCookie);
    expect(res.status).toBe(401);
  });

  test('Admin should access dashboard and see sales data', async () => {
    const res = await agent.get('/admin/dashboard').set('Cookie', adminCookie);
    expect(res.status).toBe(200);
    expect(res.body.totalRevenue).toBe(25);
    expect(res.body.totalOrders).toBe(2);
    expect(Array.isArray(res.body.users)).toBe(true);
  });
});
