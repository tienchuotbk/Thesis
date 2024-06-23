import JobApi from "@/network/job";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Layout, Row, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import CompanyInformation from "./CompanyInformation";
import JobInfomation from "./JobInformation";
import JobRecommend from "../JobRecommend";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slice/user.slice";

export default function JobDetail() {
  const { id = "" } = useParams();
  const uid = useSelector(selectUser);

  const { isPending, data } = useQuery({
    queryKey: ["job-detail", id],
    queryFn: async () => {
      const jobData = await JobApi.getById(id, uid);
      if (jobData && jobData.data) {
        return jobData.data;
      }
      {
        return null;
      }
    },
  });
  console.log(data)
  return (
    <Layout.Content className="container mx-auto pt-8">
      {isPending && <Skeleton />}
      {data && (
        <>
          <Row gutter={24}>
            <Col span={18}>
              <JobInfomation job={data} />
            </Col>
            <Col span={6}>
              <CompanyInformation job={data} />
              <Card className="mt-4">
                <div className="text-[20px] font-[600]">Ngành nghề</div>
                <div className="box-category-tags mt-2">
                  {data?.category?.map((category: string, index: number) => (
                    <div key={index} className="box-category-tag">
                      {category}
                    </div>
                  ))}
                </div>
                <div className="mt-6"></div>
                <div className="text-[20px] font-[600]">Khu Vực</div>
                <div className="box-category-tags mt-2">
                  {data?.location?.map((location: LocationType, index: number) => (
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

      <div className="mt-4"></div>
      {data && <JobRecommend id={data._id} />}
    </Layout.Content>
  );
}
