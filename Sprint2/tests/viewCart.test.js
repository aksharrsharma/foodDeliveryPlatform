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
const agent = request.agent(app); 

let userId;
let itemId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await User.deleteMany();
    await Item.deleteMany();
    await Order.deleteMany();
  
    const item = await Item.create({
      name: 'Smoothie',
      price: 4.99,
      description: 'Fresh fruit smoothie',
      image: '/images/smoothie.png'
    });
  
    itemId = item._id;
  
    const user = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      password: 'password123',
    });
  
    userId = user._id;
  
    const loginRes = await agent
      .post('/users/login')
      .send({ email: 'jane@example.com', password: 'password123' })
      .expect(302); 
  
    await Order.create({
      customerId: userId,
      items: [{ itemId: itemId, quantity: 2 }],
      totalPrice: 9.98
    });
  });
  

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /profile/mycart - View Cart Page', () => {
  test('Shows cart for logged-in user', async () => {
    const res = await agent.get('/profile/mycart');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/My Cart/);
    expect(res.text).toMatch(/Smoothie/);
    expect(res.text).toMatch(/\$4\.99/);
  });

  test('Redirects unauthenticated user to login', async () => {
    const res = await request(app).get('/profile/mycart');
=======
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

>>>>>>> 9371f14 (Initial commit for Sprint 2 updates)
    expect(res.statusCode).toBe(302);
    expect(res.headers['location']).toMatch(/login/);
  });
});
