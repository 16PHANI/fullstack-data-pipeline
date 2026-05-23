'use strict';

const request = require('supertest');

// Mock DB before loading app
jest.mock('../src/config/database', () => ({
  connect: jest.fn(),
  query: jest.fn(),
}));

const db  = require('../src/config/database');
const app = require('../src/app');

// ----------------------------------------------------------------
// Sample data fixtures
// ----------------------------------------------------------------
const sampleRow = {
  id: 1, name: 'Alice Johnson', email: 'alice@test.com',
  phone: '555-0101', region: 'North', plan: 'Premium',
  tenure_months: 36, monthly_charge: 89.99, total_charges: 3239.64,
  churn: 0, risk_score: 0.12, created_at: new Date(), updated_at: new Date(),
};

// ----------------------------------------------------------------
// Health check
// ----------------------------------------------------------------
describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ----------------------------------------------------------------
// Customer list
// ----------------------------------------------------------------
describe('GET /api/customers', () => {
  it('returns paginated list', async () => {
    db.query
      .mockResolvedValueOnce([[{ total: 1 }]])   // count query
      .mockResolvedValueOnce([[sampleRow]]);      // data query

    const res = await request(app).get('/api/customers?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(1);
  });

  it('rejects invalid page param', async () => {
    const res = await request(app).get('/api/customers?page=0');
    expect(res.status).toBe(400);
  });
});

// ----------------------------------------------------------------
// Customer get by id
// ----------------------------------------------------------------
describe('GET /api/customers/:id', () => {
  it('returns customer when found', async () => {
    db.query.mockResolvedValueOnce([[sampleRow]]);
    const res = await request(app).get('/api/customers/1');
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('alice@test.com');
    expect(res.body.data.risk_label).toBe('Low');
  });

  it('returns 404 when not found', async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/api/customers/999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for non-integer id', async () => {
    const res = await request(app).get('/api/customers/abc');
    expect(res.status).toBe(400);
  });
});

// ----------------------------------------------------------------
// Customer create
// ----------------------------------------------------------------
describe('POST /api/customers', () => {
  const newCustomer = {
    name: 'Bob Smith', email: 'bob.smith@test.com',
    region: 'South', plan: 'Basic',
    tenure_months: 3, monthly_charge: 29.99,
  };

  it('creates customer successfully', async () => {
    db.query
      .mockResolvedValueOnce([[]])                          // findByEmail → not found
      .mockResolvedValueOnce([{ insertId: 2 }])            // insert
      .mockResolvedValueOnce([[{ ...sampleRow, id: 2 }]]); // findById

    const res = await request(app).post('/api/customers').send(newCustomer);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('rejects missing name', async () => {
    const res = await request(app).post('/api/customers')
      .send({ email: 'x@y.com' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/customers')
      .send({ name: 'Test', email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('returns 409 for duplicate email', async () => {
    db.query.mockResolvedValueOnce([[sampleRow]]); // findByEmail → exists
    const res = await request(app).post('/api/customers').send(newCustomer);
    expect(res.status).toBe(409);
  });
});

// ----------------------------------------------------------------
// Customer delete
// ----------------------------------------------------------------
describe('DELETE /api/customers/:id', () => {
  it('deletes existing customer', async () => {
    db.query
      .mockResolvedValueOnce([[sampleRow]])        // getCustomer
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // delete
    const res = await request(app).delete('/api/customers/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 for missing customer', async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).delete('/api/customers/999');
    expect(res.status).toBe(404);
  });
});
