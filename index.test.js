const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('should return a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Successfully running");
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
