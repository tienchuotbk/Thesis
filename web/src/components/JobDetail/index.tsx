import JobApi from "@/network/job";
import { Col, Layout, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyInformation from "./CompanyInformation";
import JobInfomation from "./JobInformation";

export default function JobDetail() {
  const { id = "" } = useParams();
  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (id) {
        const jobData = await JobApi.getById(id);
        if (jobData && jobData.data) {
          setJob(jobData.data);
        }
      }
    } catch (e) {
      console.log("fetch job detail error: ", e);
    }
    setLoading(false);
  };

  return (
    <Layout.Content className="container mx-auto pt-8">
      {loading && <Skeleton />}
      {!loading && job && (
        <>
          <Row gutter={8}>
            <Col span={18}>
              <JobInfomation job={job} />
            </Col>
            <Col span={6}>
              <CompanyInformation job={job} />
            </Col>
          </Row>
        </>
      )}
    </Layout.Content>
  );
}
