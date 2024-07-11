import JobApi from "@/network/job";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Layout, Row, Skeleton } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CompanyInformation from "./CompanyInformation";
import JobInfomation from "./JobInformation";
import JobRecommend from "../JobRecommend";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slice/user.slice";
import { provinceMap } from "@/const/province";
import { rolesMap, typeMap } from "@/const";
import { BackwardFilled, BackwardOutlined } from "@ant-design/icons";

export default function JobDetail() {
  const { id = "" } = useParams();
  const uid = useSelector(selectUser);
  const naviage = useNavigate();

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

  return (
    <Layout.Content className="container mx-auto pt-8">
      <Button type="default" icon={<BackwardFilled />} iconPosition={"start"} className="mb-4" onClick={()=> naviage("/")}>
        Quay lại
      </Button>
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
                <div className="text-[20px] font-[600]">Vị trí tuyển dụng</div>
                <div className="box-category-tags mt-2">
                  {rolesMap.get(data.role)}
                </div>
                <div className="mt-6"></div>
                <div className="text-[20px] font-[600]">Loại hình làm việc</div>
                <div className="box-category-tags mt-2">
                  {data.type?.map((val: number) => typeMap.get(val)).join(",")}
                </div>
                <div className="mt-6"></div>
                <div className="text-[20px] font-[600]">Khu Vực</div>
                <div className="box-category-tags mt-2">
                  {data?.location?.map(
                    (location: LocationType, index: number) => (
                      // <div key={index} className="box-category-tag">
                      <p>
                        <b>{provinceMap.get(location.province)}</b> :{" "}
                        {location.address}
                      </p>
                      // </div>
                    )
                  )}
                </div>
                <div className="mt-6"></div>
                <a href={data.url} target="_blank">
                  <button>Xem chi tiết tin tại đây</button>
                </a>
              </Card>
            </Col>
          </Row>
        </>
      )}

      <div className="mt-4"></div>
      {data && <JobRecommend id={id} />}
    </Layout.Content>
  );
}
