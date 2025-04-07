<<<<<<< HEAD
=======
require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Item = require('../models/item');

let adminSession;
let itemId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  await User.deleteMany();
  await Item.deleteMany();

  const admin = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    admin: 'silverSpoon',
  });
  
  const loginRes = await request(app)
    .post('/users/login')
    .send({ email: 'admin@example.com', password: 'password123' });

  adminSession = loginRes.headers['set-cookie'];

  const item = await Item.create({
    name: 'Taco',
    description: 'Delicious crunchy taco',
    price: 5.99,
    image: '/images/default.jpg',
  });

  itemId = item._id;
});

afterAll(async () => {
  await User.deleteMany();
  await Item.deleteMany();
  await mongoose.connection.close();
});

describe('Edit Menu Item (Admin)', () => {
    test('Admin can update an item', async () => {
        const res = await request(app)
          .patch(`/items/${itemId}?_method=PATCH`)
          .set('Cookie', adminSession)
          .send({
            name: 'Taco Supreme',          
            price: 7.99,                    
            description: 'Updated Description'
          });
      
        expect(res.statusCode).toBe(302);
      
        const updatedItem = await Item.findById(itemId);
        expect(updatedItem.name).toBe('Taco Supreme');
        expect(updatedItem.price).toBe(7.99);
        expect(updatedItem.description).toBe('Updated Description');
      });
      

  test('Unauthenticated user is redirected to login', async () => {
    const res = await request(app)
      .patch(`/items/${itemId}`)
      .send({ name: 'Taco Changed' });

    expect(res.statusCode).toBe(302);
    expect(res.headers['location']).toMatch(/login/);
  });

  test('Invalid ID returns error', async () => {
    const res = await request(app)
      .patch('/items/invalid-id?_method=PATCH')
      .set('Cookie', adminSession)
      .send({ name: 'Broken' });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBeDefined();
  });
});
afterAll(async () => {
    await mongoose.connection.close();
  });
  
>>>>>>> 526a100 (Add updated test files for Sprint 2)
