const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('should return a 404 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
  });
});

describe('POST /convert', () => {
  it('should return a 400 status code if data is missing', async () => {
    const response = await request(app)
      .post('/convert')
      .send({});
    expect(response.statusCode).toBe(400);
  });
});
