const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.get('/api/searchJobs', (req, res) => {
    const skillQuery = (req.query.skill || '').toLowerCase();
    if (!skillQuery) {
        return res.status(400).json({ error: "Please provide skill query parameter" });
    }

    const results = jobListings.filter(job =>
        job.skills.some(skill => skill.includes(skillQuery))
    );

    res.json(results);
});
const jobListings = [
    {
        id: 1,
        company: "Company A",
        position: "Java Developer",
        skills: ["java", "spring"],
        applyUrl: "https://companya.com/apply",
        location: "Delhi",
        salary: 50000,       // monthly salary in INR
        experience: 2        // years of experience required
    },
    {
        id: 2,
        company: "Company B",
        position: "Python Engineer",
        skills: ["python", "django"],
        applyUrl: "https://companyb.com/apply",
        location: "Mumbai",
        salary: 60000,
        experience: 3
    },
    {
        id: 3,
        company: "Company C",
        position: "Cloud Architect",
        skills: ["azure", "cloud"],
        applyUrl: "https://companyc.com/apply",
        location: "Bangalore",
        salary: 90000,
        experience: 5
    },
    {
        id: 4,
        company: "Company D",
        position: "Fullstack Developer",
        skills: ["java", "react"],
        applyUrl: "https://companyd.com/apply",
        location: "Hyderabad",
        salary: 55000,
        experience: 1
    }
];

app.listen(PORT, () => {
    console.log(`Backend API listening at http://localhost:${PORT}`);
});
