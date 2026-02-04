const axios = require('axios');

async function runSmokeTest() {
    try {
        const res = await axios.get('http://<ENVIRONMENT_URL>/api/health');
        if (res.status === 200 && res.data.status === 'ok') {
            console.log('Smoke test passed!');
            process.exit(0);
        } else {
            console.error('Smoke test failed: Unexpected response');
            process.exit(1);
        }
    } catch (error) {
        console.error('Smoke test failed:', error.message);
        process.exit(1);
    }
}

runSmokeTest();
