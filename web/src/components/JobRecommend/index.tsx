import { provinceMap } from "@/const/province";
import { getLogoSrc } from "@/helpers/job.helper";
import JobApi from "@/network/job";
import { selectUser } from "@/redux/slice/user.slice";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Image, Row, Tag, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
};

export default function JobRecommend({ id }: Props) {
  const uid = useSelector(selectUser);
  const navigate = useNavigate();
  const { isLoading, data } = useQuery({
    queryKey: ["job-recommend", id],
    queryFn: async () => {
      const res = await JobApi.getListRecommendById(id, uid);
      if (res && res.payload) {
        return res.payload;
      } else {
        return [];
      }
    },
    enabled: !!uid.length,
  });

  const getProvinces = (locations: any[]) => {
    if (!locations) return [];
    const allProvinces = locations.map((location) => location.province);
    return [...new Set(allProvinces)];
  };

  return (
    <Card className="mt-4">
      <Typography.Text className="text-[20px] font-[600] border-l-[6px] border-[#2428a5] pl-3">
        Bạn có thể quan tâm
      </Typography.Text>

      {/* {isLoading && (
        <div className="mt-4">
          <Spin tip="Đang tải...">
            <Alert
              message="Đang tải dữ liệu"
              description="Việc này có thể mất vài giây. Bình tĩnh!"
              type="info"
            />
          </Spin>
        </div>
      )} */}
      {/* {!isLoading && ( */}
      <div className="mt-4 max-w-[1096px]">
        {data &&
          data?.map((job: JobType) => {
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
                          <span className="uppercase mt-2">
                            {job.category?.length
                              ? job.category.map((val: string) => (
                                  <Tag>{val}</Tag>
                                ))
                              : null}
                          </span>
                          <div className="mt-2 pd-2">
                            <ul>
                              {getProvinces(job.location).map((val: string) => (
                                <li>{provinceMap.get(val)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="box-right">
                          <label className="text-[#2428a5] font-[600]">
                            {job.company}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      {/* <div className="label-content">
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
                        </div> */}
                      {/* <div className="icon">
                        <button
                          data-job-id="1352601"
                          data-apply-url=""
                          data-redirect-to="https://www.topcv.vn/viec-lam/nodejs-developer/1352601.html?ta_source=SuggestSimilarJob_ButtonApplyFormCard&amp;jr_i=job-es-v1%3A%3A1718511680359-ade656%3A%3A7ba9ba8a6eec41099895c77733a91050%3A%3A1%3A%3A1.0000"
                          className="btn btn-apply-now"
                        >
                          <span>Ứng tuyển</span>
                        </button>
                        <div
                          id="box-save-job-1352601"
                          className="box-save-job  box-save-job-hover   job-saved "
                        >
                          <a
                            href="javascript:void(0)"
                            className="btn-save save"
                            data-id="1352601"
                            data-title="Lưu"
                            data-toggle="tooltip"
                            data-placement="top"
                            data-original-title=""
                            title=""
                          >
                            <span id="save-job-loading" style={{ display: "none" }}>
                              <img
                                src="https://www.topcv.vn/v3/images/ap-loading.gif"
                                className="w-[20px]"
                              />
                            </span>
                            <i className="fa-regular fa-heart"></i>
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn-unsave unsave text-highlight"
                            data-toggle="tooltip"
                            title=""
                            data-id="1352601"
                            data-title="NodeJS Developer"
                            data-placement="top"
                            data-original-title="Bỏ lưu"
                          >
                            <span id="unsave-job-loading" style={{ display: "none" }}>
                              <img
                                src="https://www.topcv.vn/v3/images/ap-loading.gif"
                                className="w-[20px]"
                              />
                            </span>
                            <i className="fa-solid fa-heart"></i>
                          </a>
                        </div>
                      </div> */}
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
      </div>
      {/* )} */}
    </Card>
  );
}
