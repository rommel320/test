const request = require('supertest');

// Mock entire models module
jest.mock('../models', () => ({
  sequelize: {
    sync: jest.fn().mockResolvedValue(),
    close: jest.fn().mockResolvedValue(),
    authenticate: jest.fn().mockResolvedValue()
  },
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  },
  Restaurant: {
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn()
  },
  Order: {
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn()
  }
}));

// Mock utils
jest.mock('../utils/jwt', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token'),
  verifyToken: jest.fn().mockReturnValue({ userId: 1 })
}));

const { app } = require('../server');
const { User } = require('../models');

describe('Auth API', () => {
  let token;
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
  };
  
  test('Register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body).toHaveProperty('token');
  });

  test('Login with registered user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200);
    
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  test('Fetch current user profile', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(response.body.user.email).toBe(userData.email);
  });
});

describe('Restaurants API', () => {
  test('Get all restaurants', async () => {
    await request(app)
      .get('/api/restaurants')
      .expect(200);
  });

  test('Get specific restaurant by ID should return 404 for non-existent', async () => {
    await request(app)
      .get('/api/restaurants/123')
      .expect(404);
  });
});

describe('Orders API', () => {
  test('Get orders without authentication should return 401', async () => {
    await request(app)
      .get('/api/orders')
      .expect(401);
  });
});
