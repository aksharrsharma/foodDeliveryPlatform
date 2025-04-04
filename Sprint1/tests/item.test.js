require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Item = require('../models/item');
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterEach(async () => {
  await Item.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Item Functionality', () => {
  it('3️⃣ should let an admin create a menu item', async () => {
  
    await request(app).post('/users').send({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'AdminPass123',
      admin: 'silverSpoon'
    });

    const login = await request(app).post('/users/login').send({
      email: 'admin@example.com',
      password: 'AdminPass123'
    });

    const cookie = login.headers['set-cookie'];

    const res = await request(app)
      .post('/items')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        price: 12.99,
        description: 'Cheesy pizza'
      });

    expect([200, 201, 302]).toContain(res.statusCode);
    const item = await Item.findOne({ name: 'Pizza' });
    expect(item).toBeTruthy();
  });
});
