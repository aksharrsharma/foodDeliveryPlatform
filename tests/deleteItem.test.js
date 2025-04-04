const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const Item = require('../models/item');

let adminSession;
let itemId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany();
  await Item.deleteMany();

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    admin: 'silverSpoon',
  });

  const loginRes = await request(app)
    .post('/users/login')
    .send({ email: 'admin@example.com', password: 'password123' });

  adminSession = loginRes.headers['set-cookie'];

  const item = await Item.create({
    name: 'Burger',
    description: 'Juicy burger with cheese',
    price: 6.99,
  });

  itemId = item._id;
});

afterAll(async () => {
  await User.deleteMany();
  await Item.deleteMany();
  await mongoose.disconnect();
});

describe('Delete Menu Item (Admin)', () => {
  test('Admin can delete an item', async () => {
    const res = await request(app)
      .delete(`/items/${itemId}?_method=DELETE`)
      .set('Cookie', adminSession);

    expect(res.statusCode).toBe(302);
    const deleted = await Item.findById(itemId);
    expect(deleted).toBeNull();
  });

  test('Unauthenticated user is redirected to login', async () => {
    const item = await Item.create({
      name: 'Temp Item',
      description: 'Temporary item for delete test',
      price: 3.99,
    });

    const res = await request(app).delete(`/items/${item._id}?_method=DELETE`);
    expect(res.statusCode).toBe(302); // Redirect to login
  });

  test('Invalid ID returns error', async () => {
    const res = await request(app)
      .delete('/items/invalid-id?_method=DELETE')
      .set('Cookie', adminSession);

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
