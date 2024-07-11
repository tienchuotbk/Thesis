import JobApi from "@/network/job";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Skeleton,
  Typography,
  Image
} from "antd";
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
  const navigate = useNavigate();

  const { data: recentData } = useQuery({
    queryKey: ["job-recent", id],
    queryFn: async () => {
      const jobData = await JobApi.getRecent(id, uid);
      if (jobData && jobData.data) {
        return jobData.data;
      }
      {
        return [];
      }
    },
    enabled: !!uid
  })

  const { isPending, data } = useQuery({
    queryKey: ["job-detail", id],
    queryFn: async () => {
      const jobData = await JobApi.getById(id, uid);
      if (jobData && jobData.data) {
        return jobData.data;
      }
      {
        return {};
      }
    },
  });

  return (
    <Layout.Content className="container mx-auto pt-8">
      <Button
        type="default"
        icon={<BackwardFilled />}
        iconPosition={"start"}
        className="mb-4"
        onClick={() => navigate("/")}
      >
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
              <Card className="mt-4" style={{ width: "100%"}}>
                <Typography.Text className="text-[20px] font-[600] border-l-[6px] border-[#2428a5] pl-3">
                  Việc làm vừa xem
                </Typography.Text>
                <Col className="mt-2 pd-0" >
                {recentData?.map((job:any)=> (
                  <Row>
                    <Card className="mb-2">
                      <Flex justify="space-start" gap={"middle"}>
                        <Image
                          src={job.logo}
                          preview={false}
                          className="!h-[35px] !w-[35px] object-contain"
                        />
                        <Flex justify="space-start" gap="small" vertical>
                          <p
                            className="font-bold text-slate-700 cursor-pointer hover:text-[#69b1ff]"
                            onClick={() => navigate("/job/" + job._id)}
                          >
                            {job.title}
                          </p>
                          <div className="text-xs">{job.company}</div>
                        </Flex>
                      </Flex>
                    </Card>
                  </Row>
                ))}
                </Col>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Layout.Content>
  );
}
