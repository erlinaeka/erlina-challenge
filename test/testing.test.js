/* eslint-disable import/extensions, import/no-unresolved */
const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should response with 200 as status code', async () => {
    const status = 'OK';
    const message = 'BCR API is up and running!';

    return request(app)
      .get('/')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status, message });
      });
  });
});

describe('GET /v1/tasks', () => {
  it('should response with 200 as status code', async () => {
    request(app)
      .get('/v1/cars')
      .expect(200)
      .expect((res) => {
      // eslint-disable-next-line no-unused-expressions
        res.body.data.length > 1;
        res.body.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
            }),
          ]),
        );
      });
  });
});
