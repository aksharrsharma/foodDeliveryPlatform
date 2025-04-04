require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('User Functionality', () => {
  it('1️⃣ should register a guest user', async () => {
    const res = await request(app).post('/users').send({
      firstName: 'Alima',
      lastName: 'Conde',
      email: 'alima@example.com',
      password: 'Password123',
      admin: 'notAdmin'
    });

    expect(res.statusCode).toBe(201); 
    expect(res.body.message).toBe('User created');

    const user = await User.findOne({ email: 'alima@example.com' });
    expect(user).toBeTruthy();
  });

  it('2️⃣ should login a guest with correct credentials', async () => {
    
    await request(app).post('/users').send({
      firstName: 'Alima',
      lastName: 'Conde',
      email: 'login@example.com',
      password: 'Password123',
      admin: 'notAdmin'
    });

 
    const res = await request(app).post('/users/login').send({
      email: 'login@example.com',
      password: 'Password123'
    });

    expect(res.statusCode).toBe(200); 
    expect(res.body.message).toBe('Login successful');
  });
});
