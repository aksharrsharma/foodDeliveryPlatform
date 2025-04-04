const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const Item = require('../models/item');
const Order = require('../models/order');

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
    expect(res.statusCode).toBe(302);
    expect(res.headers['location']).toMatch(/login/);
  });
});
