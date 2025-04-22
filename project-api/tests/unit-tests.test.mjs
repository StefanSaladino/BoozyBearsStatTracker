import request from 'supertest';
import chai from 'chai';
import { app, conn } from '../server.js';

const expect = chai.expect;

// 👇 hardcoded credentials for login (matches Admin model)
const adminCredentials = {
  email: 'admin@admin.com',
  password: 'password123', 
};

describe('🧪 Session Persistence', () => {
  const agent = request.agent(app); // persist cookies across requests

  after(async () => {
    await conn.close(); // gracefully close Mongo connection after tests
  });

  it('❌ should block access to /admin before login', async () => {
    const res = await agent.get('/admin-dashboard');
    expect(res.status).to.equal(401); // adjust if you're returning 403 or redirecting
  });

  it('✅ should log in with valid admin credentials', async () => {
    const res = await agent
      .post('/login')
      .send(adminCredentials)
      .expect(200);

    expect(res.body).to.have.property('message').that.includes('success');
  });

  it('🔐 should allow access to /admin after login', async () => {
    const res = await agent.get('/admin-dashboard');
    expect(res.status).to.equal(200); 
    expect(res.text || res.body).to.exist;
  });

  it('🚪 should logout and restrict access to /admin again', async () => {
    await agent.post('/logout').expect(200);
    
    const res = await agent.get('/admin-dashboard');
    expect(res.status).to.equal(401); // blocked again after logout
  });
});
