const request = require('supertest');
const {
  expect,
  describe,
  test,
  afterAll,
} = require('@jest/globals');

const conn = require('../../config/sequelize-connect');
const app = require('../../app');

let authorizationToken;
let UserData;

describe('APIs Testing...', () => {
  test('Register User API...', async () => {
    const res = await request(app)
      .post('/api/v1/account/register')
      .send({
        name: 'Testing User',
        email: 'testing@mailinator.com',
        role: 'user',
        password: 'TestingPwd',
        status: true,
      });
    UserData = res.body.data;
    expect(res.statusCode).toBe(200);
  });

  test('Login User API...', async () => {
    const res = await request(app)
      .post('/api/v1/account/login')
      .send({
        email: 'testing@mailinator.com',
        password: 'TestingPwd',
      });
    authorizationToken = res.body.data.encryptedToken;
    expect(res.statusCode).toBe(200);
  });

  test('User Profile API...', async () => {
    const res = await request(app)
      .get('/api/v1/account/profile')
      .set('authorization', authorizationToken);
    expect(res.statusCode).toBe(200);
  });

  test('Get All Users API...', async () => {
    const res = await request(app)
      .get('/api/v1/account/users')
      .set('authorization', authorizationToken);
    expect(res.statusCode).toBe(200);
  });

  test('Find one user by Id API...', async () => {
    const res = await request(app)
      .get(`/api/v1/account/users?id=${UserData.id}`)
      .set('authorization', authorizationToken);
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  try {
    await conn.dbDisconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
