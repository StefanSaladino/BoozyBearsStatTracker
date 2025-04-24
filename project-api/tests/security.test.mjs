import request from 'supertest';
import chai from 'chai';
import { app, conn } from '../server.js';
import Admin from '../models/admin.js';

const expect = chai.expect;
const agent = request.agent(app);

const adminCredentials = {
  email: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};

describe('🔐 Auth Security Features', () => {

  it('🚫 should block registration if admin already exists', async () => {
    const res = await agent
      .post('/register')
      .send({ email: 'hacker@hack.com', password: 'haxxor' })
      .expect(403); // forbidden
      expect(res.body).to.have.property('error').that.includes('disabled');
  });

  it('✅ should log in with valid credentials after cooldown or bypassing limiter', async () => {
    // You may want to mock the limiter or use a different agent here
    const res = await agent
      .post('/login')
      .send(adminCredentials)
      .expect(200);
    expect(res.body).to.have.property('message');
  });

  it('🔐 should access protected route after login', async () => {
    const res = await agent.get('/admin-dashboard');
    expect(res.status).to.equal(200);
  });

  it('🚪 should logout and restrict access again', async () => {
    await agent.post('/logout').expect(200);
    const res = await agent.get('/admin-dashboard');
    expect(res.status).to.equal(401);
  });
  
  it('🛡️ should rate-limit login after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/login').send({ email: 'admin@admin.com', password: 'wrongpass' });
    }
    const res = await request(app).post('/login').send({ email: 'admin@admin.com', password: 'wrongpass' });
    expect(res.status).to.equal(429);
    expect(res.body.message).to.include('Too many login attempts');
  });
});
