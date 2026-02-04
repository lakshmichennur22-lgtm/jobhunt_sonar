const request = require('supertest');
const app = require('../server'); // import your Express app

describe("Integration Tests for Job Search API", () => {
    test("GET /searchJobs returns jobs with 'java' skill", async () => {
        const response = await request(app).get('/searchJobs?skill=java');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('position');
    });

    test("Health check endpoint responds correctly", async () => {
        const response = await request(app).get('/api/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("ok");
    });
});
