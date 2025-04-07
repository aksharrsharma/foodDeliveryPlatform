require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Item = require('../models/item');
const Order = require('../models/order');

let userSession;
let itemId;
let userId;

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
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  });

  const loginRes = await request(app)
    .post('/users/login')
    .send({ email: 'user1@example.com', password: 'password123' });

  userSession = loginRes.headers['set-cookie'];
  userId = user._id;

  const item = await Item.create({
    name: 'Taco',
    description: 'Delicious crunchy taco',
    price: 5.99,
    image: '/images/default.jpg',
  });

  itemId = item._id;

  const order = await Order.create({
    customerId: userId,
    items: [{ itemId: itemId, quantity: 1 }],
    totalPrice: 5.99,
  });
});

afterAll(async () => {
 
  await User.deleteMany();
  await Item.deleteMany();
  await Order.deleteMany();
  await mongoose.connection.close();
});

describe('View Cart (Logged-In User)', () => {
  test('User can view their cart', async () => {
    const res = await request(app)
      .get('/profile/mycart')
      .set('Cookie', userSession);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('My Cart');
    expect(res.text).toContain('Taco');
    expect(res.text).toContain('5.99');
  });

  test('Unauthenticated user is redirected to login when trying to view the cart', async () => {
    const res = await request(app).get('/profile/mycart');

    expect(res.statusCode).toBe(302);
    expect(res.headers['location']).toMatch(/login/);
  });
});
