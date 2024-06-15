import JobApi from "@/network/job";
import { Card, Col, Layout, Row, Skeleton } from "antd";
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
          <Row gutter={24}>
            <Col span={18}>
              <JobInfomation job={job} />
            </Col>
            <Col span={6}>
              <CompanyInformation job={job} />
              <Card className="mt-4">
                <div className="text-[20px] font-[600]">Ngành nghề</div>
                <div className="box-category-tags mt-2">
                  {job?.category?.map((category, index) => (
                    <div key={index} className="box-category-tag">
                      {category}
                    </div>
                  ))}
                </div>
                <div className="mt-6"></div>
                <div className="text-[20px] font-[600]">Khu Vực</div>
                <div className="box-category-tags mt-2">
                  {job?.location?.map((location, index) => (
                    <div key={index} className="box-category-tag">
                      {location.province}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Layout.Content>
  );
}
