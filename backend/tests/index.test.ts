import request from 'supertest';
import app from '../src/index';

// Mock da função connectDB para não tentar se conectar ao MongoDB durante os testes
jest.mock('../src/config/database', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

describe('Testes da API', () => {
  it('GET / - deve retornar Hello World', async () => {
    const response = await request(app).get('/');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Hello World!');
  });
});
