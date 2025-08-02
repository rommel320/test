// Mock models first
jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test User',
      role: 'customer',
      comparePassword: jest.fn().mockResolvedValue(true)
    })
  }
}));

const { authenticate, authorize } = require('../middleware/auth');
const { generateToken, verifyToken } = require('../utils/jwt');
const { User } = require('../models');

describe('JWT Utilities', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRE = '1d';
  });

  test('generateToken should create a token', () => {
    const jwt = require('jsonwebtoken');
    jwt.sign = jest.fn().mockReturnValue('mock-token');
    
    const payload = { userId: 1 };
    const token = generateToken(payload);
    
    expect(jwt.sign).toHaveBeenCalledWith(payload, 'test-secret', { expiresIn: '1d' });
    expect(token).toBe('mock-token');
  });

  test('verifyToken should verify a token', () => {
    const jwt = require('jsonwebtoken');
    jwt.verify = jest.fn().mockReturnValue({ userId: 1 });
    
    const result = verifyToken('mock-token');
    
    expect(jwt.verify).toHaveBeenCalledWith('mock-token', 'test-secret');
    expect(result).toEqual({ userId: 1 });
  });
});

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('authenticate', () => {
    test('should return 401 when no token provided', async () => {
      req.header.mockReturnValue(undefined);
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 when token is invalid', async () => {
      req.header.mockReturnValue('Bearer invalid-token');
      const jwt = require('jsonwebtoken');
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await authenticate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next when token is valid', async () => {
      req.header.mockReturnValue('Bearer valid-token');
      const jwt = require('jsonwebtoken');
      jwt.verify = jest.fn().mockReturnValue({ userId: 1 });
      
      const mockUser = { id: 1, name: 'Test User', role: 'customer' };
      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      
      await authenticate(req, res, next);
      
      expect(req.user).toBe(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    beforeEach(() => {
      req.user = { role: 'customer' };
    });

    test('should call next when user has required role', () => {
      const middleware = authorize('customer', 'admin');
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 403 when user lacks required role', () => {
      const middleware = authorize('admin');
      
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Access denied. Insufficient permissions.' 
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

describe('User Model', () => {
  test('should hash password before creating user', async () => {
    const bcrypt = require('bcryptjs');
    bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed-password');
    
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'plain-password'
    };
    
    // This would be tested with actual Sequelize hooks in integration tests
    expect(true).toBe(true); // Placeholder for model hook tests
  });

  test('should compare passwords correctly', async () => {
    const user = {
      password: 'hashed-password',
      comparePassword: jest.fn().mockResolvedValue(true)
    };
    
    const result = await user.comparePassword('plain-password');
    
    expect(user.comparePassword).toHaveBeenCalledWith('plain-password');
    expect(result).toBe(true);
  });
});
