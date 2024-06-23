import { getLogoSrc } from "@/helpers/job.helper";
import JobApi from "@/network/job";
import { selectUser } from "@/redux/slice/user.slice";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Image, Row, Typography } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function JobRecommend() {
  const navigate = useNavigate();
  const uid = useSelector(selectUser);

  const { isLoading, data } = useQuery({
    queryKey: ["job-recommend", uid],
    queryFn: async () => {
      const res = await JobApi.getListRecommendById(uid);
      if (res && res.payload) {
        return JSON.parse(res.payload);
      } else {
        return [];
      }
    },
    enabled: !!uid.length,
  });

  return (
    <Card className="mt-4">
      <Typography.Text className="text-[20px] font-[600] border-l-[6px] border-[#00b14f] pl-3">
        Việc làm liên quan
      </Typography.Text>

      <div className="mt-4 max-w-[1096px]">
        {data &&
          data.map((job: JobType) => {
            return (
              <div
                key={job._id}
                className="mt-4 rounded border-[1px] border-[#ccc] border-solid overflow-hidden p-4"
              >
                <Row gutter={24}>
                  <Col span={4}>
                    <Image
                      src={getLogoSrc(job.logo)}
                      preview={false}
                      className="!h-[100px] !w-[100px] object-contain"
                    />
                  </Col>
                  <Col span={20} className="">
                    <div className="">
                      <div className="flex justify-between">
                        <div>
                          <h3
                            className="font-bold text-[18px] cursor-pointer hover:text-[#69b1ff]"
                            onClick={() => navigate("/job/" + job._id)}
                          >
                            {job.title}
                          </h3>
                          <span className="uppercase mt-2">{job.company}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <div className="label-content">
                        <label
                          className="address"
                          data-toggle="tooltip"
                          data-html="true"
                          title=""
                          data-placement="top"
                          data-original-title="<p style='text-align: left'>Hà Nội: Nam Từ Liêm</p>"
                        >
                          {job?.location[0]?.province}
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
      </div>
    </Card>
  );
}
