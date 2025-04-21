require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); 

const User = require('../models/user');  
const Item = require('../models/item');

let mongoServer;
let agent;

describe('Favorites Feature', () => {
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
      name: 'Pizza',
      price: 12,
      description: 'Hot pizza',
      image: 'pizza.jpg',
      available: true
    });

    const user = await User.findOne({ email: 'user@example.com' });
    user.favorites.push({ dishId: item._id });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Should show user favorites on /profile/favorites', async () => {
    const res = await agent.get('/profile/favorites').set('Cookie', userCookie);
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Pizza/);
  });
});
