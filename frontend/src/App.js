import { SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Layout,
  List,
  Pagination,
  Slider,
  Typography,
  message
} from "antd";
import { useEffect, useState } from "react";
import { searchJobs } from "./Api"; // 👈 import API function

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;

const PAGE_SIZE = 5;

const experienceOptions = [
  { label: "0 - 1 years", value: "0-1" },
  { label: "1 - 3 years", value: "1-3" },
  { label: "3 - 5 years", value: "3-5" },
  { label: "5+ years", value: "5+" },
];

export default function App({ darkMode }) {
  const [skillSearch, setSkillSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [salaryRange, setSalaryRange] = useState([0, 200000]); // in INR/month
  const [selectedExperience, setSelectedExperience] = useState([]);

  // Options for filters
  const [allCompanies, setAllCompanies] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  // Fetch jobs
  const fetchJobs = async () => {
    if (!skillSearch.trim()) {
      message.warning("Please enter a skill in search box.");
      return;
    }
    setLoading(true);
    try {
      const data = await searchJobs(skillSearch); // 👈 use API service
      setJobs(data);
      setCurrentPage(1);

      setAllCompanies([...new Set(data.map((job) => job.company))].sort());
      setAllSkills([...new Set(data.flatMap((job) => job.skills || []))].sort());
      setAllLocations([...new Set(data.map((job) => job.location || "Unknown"))].sort());

      setSelectedCompanies([]);
      setSelectedSkills([]);
      setSelectedLocations([]);
      setSelectedExperience([]);
      setSalaryRange([0, 200000]);
    } catch {
      message.error("Failed to fetch jobs.");
      setJobs([]);
      setAllCompanies([]);
      setAllSkills([]);
      setAllLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on criteria
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const companyMatch =
        selectedCompanies.length === 0 || selectedCompanies.includes(job.company);
      const skillsMatch =
        selectedSkills.length === 0 ||
        selectedSkills.every((fSkill) =>
          (job.skills || []).some((jobSkill) => jobSkill === fSkill)
        );
      const locationMatch =
        selectedLocations.length === 0 ||
        selectedLocations.includes(job.location || "Unknown");
      const salaryMatch =
        job.salary >= salaryRange[0] && job.salary <= salaryRange[1];
      const experienceMatch =
        selectedExperience.length === 0 ||
        selectedExperience.some((expRange) => {
          switch (expRange) {
            case "0-1":
              return job.experience >= 0 && job.experience <= 1;
            case "1-3":
              return job.experience > 1 && job.experience <= 3;
            case "3-5":
              return job.experience > 3 && job.experience <= 5;
            case "5+":
              return job.experience > 5;
            default:
              return true;
          }
        });

      return companyMatch && skillsMatch && locationMatch && salaryMatch && experienceMatch;
    });
    const start = (currentPage - 1) * PAGE_SIZE;
    setFilteredJobs(filtered.slice(start, start + PAGE_SIZE));
  }, [
    jobs,
    selectedCompanies,
    selectedSkills,
    selectedLocations,
    salaryRange,
    selectedExperience,
    currentPage,
  ]);

  return (
    <div
      style={{
        background: darkMode ? "#1f1f1f" : "#fff",
        minHeight: "100vh",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ color: "white", fontSize: 24 }}>
          Job Search Portal
        </Header>
        <Layout>
          {/* Filters Sidebar */}
          <Sider width={300} style={{ background: darkMode ? "#141414" : "#fff", padding: "20px" }}>
            <Title level={4} style={{ color: darkMode ? "#fff" : "inherit" }}>
              Filters
            </Title>

            <Divider style={{ borderColor: darkMode ? "#444" : undefined }}>Companies</Divider>
            <Checkbox.Group
              options={allCompanies}
              value={selectedCompanies}
              onChange={setSelectedCompanies}
              style={{ maxHeight: 120, overflowY: "auto" }}
            />

            <Divider style={{ borderColor: darkMode ? "#444" : undefined }}>Skills</Divider>
            <Checkbox.Group
              options={allSkills}
              value={selectedSkills}
              onChange={setSelectedSkills}
              style={{ maxHeight: 120, overflowY: "auto" }}
            />

            <Divider style={{ borderColor: darkMode ? "#444" : undefined }}>Locations</Divider>
            <Checkbox.Group
              options={allLocations}
              value={selectedLocations}
              onChange={setSelectedLocations}
              style={{ maxHeight: 120, overflowY: "auto" }}
            />

            <Divider style={{ borderColor: darkMode ? "#444" : undefined }}>Salary (₹ per month)</Divider>
            <Slider
              range
              min={0}
              max={200000}
              step={1000}
              value={salaryRange}
              onChange={setSalaryRange}
              tooltip={{ formatter: (val) => `₹${val}` }}
            />

            <Divider style={{ borderColor: darkMode ? "#444" : undefined }}>Experience (Years)</Divider>
            <Checkbox.Group
              options={experienceOptions}
              value={selectedExperience}
              onChange={setSelectedExperience}
              style={{ marginBottom: 20 }}
            />
          </Sider>

          {/* Main Content */}
          <Content style={{ padding: "20px", maxWidth: 700 }}>
            <Input.Search
              placeholder="Search by skill (e.g., Java, Python)"
              enterButton={<Button icon={<SearchOutlined />}>Search</Button>}
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              onSearch={fetchJobs}
              size="large"
              loading={loading}
            />

            {loading ? (
              <div style={{ marginTop: 50, textAlign: "center" }}>
                <Badge status="processing" text="Loading jobs..." />
              </div>
            ) : (
              <>
                <List
                  grid={{ gutter: 16, column: 1 }}
                  dataSource={filteredJobs}
                  locale={{
                    emptyText: loading ? "Loading..." : "No jobs found",
                  }}
                  style={{ marginTop: 20 }}
                  renderItem={(job) => (
                    <List.Item key={job.id}>
                      <Card
                        title={`${job.position} (${job.experience} yrs)`}
                        extra={
                          <Button
                            type="link"
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply
                          </Button>
                        }
                        style={{ background: darkMode ? "#222" : undefined, color: darkMode ? "#fff" : undefined }}
                      >
                        <Text strong style={{ color: darkMode ? "#fff" : undefined }}>
                          {job.company}
                        </Text>{" "}
                        &nbsp;|&nbsp;{" "}
                        <Text style={{ color: darkMode ? "#ccc" : undefined }}>
                          {job.location || "Unknown"}
                        </Text>
                        <br />
                        <Text style={{ color: darkMode ? "#ccc" : undefined }}>
                          Salary: ₹{job.salary?.toLocaleString() || "N/A"}
                        </Text>
                        <br />
                        <Badge
                          count={`Skills: ${job.skills?.join(", ")}`}
                          style={{ backgroundColor: "#108ee9" }}
                        />
                      </Card>
                    </List.Item>
                  )}
                />

                {jobs.length > PAGE_SIZE && (
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={jobs.length}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: "center", marginTop: 20 }}
                    showSizeChanger={false}
                  />
                )}
              </>
            )}
          </Content>

          {/* Summary Sidebar */}
          <Sider width={250} style={{ background: darkMode ? "#141414" : "#fff", padding: "20px" }}>
            <Title level={4} style={{ color: darkMode ? "#fff" : undefined }}>
              Summary
            </Title>
            <div>
              <Text strong>Total Jobs: </Text>
              <Text>{jobs.length}</Text>
            </div>
            <Divider />
            <div>
              <Text strong>Companies</Text>
              <List
                size="small"
                dataSource={allCompanies}
                renderItem={(item) => (
                  <List.Item>
                    {item} ({jobs.filter((job) => job.company === item).length})
                  </List.Item>
                )}
              />
            </div>
            <Divider />
            <div>
              <Text strong>Skills</Text>
              <List
                size="small"
                dataSource={allSkills}
                renderItem={(item) => (
                  <List.Item>
                    {item} ({jobs.filter((job) => (job.skills || []).includes(item)).length})
                  </List.Item>
                )}
              />
            </div>
            <Divider />
            <div>
              <Text strong>Locations</Text>
              <List
                size="small"
                dataSource={allLocations}
                renderItem={(item) => (
                  <List.Item>
                    {item} ({jobs.filter((job) => (job.location || "Unknown") === item).length})
                  </List.Item>
                )}
              />
            </div>
            <Divider />
            <div>
              <Text strong>Salary Range</Text>
              <div>
                ₹{salaryRange[0].toLocaleString()} - ₹{salaryRange[1].toLocaleString()}
              </div>
            </div>
            <Divider />
            <div>
              <Text strong>Experience Selected</Text>
              <ul>
                {selectedExperience.length === 0 ? (
                  <li>All</li>
                ) : (
                  selectedExperience.map((exp) => <li key={exp}>{exp} years</li>)
                )}
              </ul>
            </div>
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
}
