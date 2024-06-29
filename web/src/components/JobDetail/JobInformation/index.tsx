import { Card, Image, Typography } from "antd";

type Props = {
  job: JobType;
};
import salarySvg from "@/assets/svg/salary.svg";
import { ClockCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { getExpString, getSalaryText } from "@/helpers/job.helper";
import { levelOptions } from "@/const/options";

export default function JobInfomation({ job }: Props) {
  return (
    <>
      <Card title={<span className="text-[20px]">{job.title}</span>}>
        <div className="flex">
          <div className="flex flex-1">
            <Image src={salarySvg} className="job-detail__info--section-icon" preview={false} />
            <div className="pl-4">
              <div>Mức lương</div>
              <div className="font-bold">
                {getSalaryText(job.salary)}
              </div>
            </div>
          </div>
          <div className="flex flex-1">
            <Image src={salarySvg} className="job-detail__info--section-icon" preview={false} />
            <div className="pl-4">
              <div>Địa điểm</div>
              <div className="font-bold">{job.location?.map((val)=> val.province).join(',')}</div>
            </div>
          </div>
          <div className="flex flex-1">
            <Image src={salarySvg} className="job-detail__info--section-icon" preview={false} />
            <div className="pl-4">
              <div>Kinh nghiệm</div>
              <div className="font-bold">{getExpString(job.experience)}</div>
            </div>
          </div>
          <div className="flex flex-1">
            <Image src={salarySvg} className="job-detail__info--section-icon" preview={false} />
            <div className="pl-4">
              <div>Yêu cầu trình độ</div>
              <div className="font-bold">{levelOptions.find((val)=> val.value === parseInt(job.certificate ? job.certificate : '0'))?.label}</div>
            </div>
          </div>
        </div>
        <div className="flex">
          {new Date(job.expiration) > new Date() ? (
            <div className="mt-6 bg-[#f2f4f5] text-[#263a4d] flex py-[2px] px-2 rounded">
              <ClockCircleOutlined />
              <span className="ml-2">
                Hạn nộp hồ sơ:{" "}
                {new Date(job.expiration).toLocaleDateString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </span>
            </div>
          ) : (
            <div className="job-detail__expired mt-6">
              <WarningOutlined />
              Hết hạn ứng tuyển:  {new Date(job.expiration).toLocaleDateString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
            </div>
          )}
        </div>
      </Card>
      <Card className="mt-4">
        <Typography.Text className="text-[20px] font-[600] border-l-[6px] border-[#00b14f] pl-3">
          Chi tiết tin tuyển dụng
        </Typography.Text>

        <div className="font-[500] text-[18px] mt-4">Mô tả công việc</div>
        {job.description.length && (
          <ul className="list-disc ml-8">
            {job.description.map((description, index) => {
              return <li key={index}>{description}</li>;
            })}
          </ul>
        )}

        <div className="font-[500] text-[18px] mt-4"> Yêu cầu ứng viên</div>
        {job.requirement.length && (
          <ul className="list-disc ml-8">
            {job.requirement.map((requirement, index) => {
              return <li key={index}>{requirement}</li>;
            })}
          </ul>
        )}

        <div className="font-[500] text-[18px] mt-4"> Quyền lợi</div>
        {job.benefit.length && (
          <ul className="list-disc ml-8">
            {job.benefit.map((benefit, index) => {
              return <li key={index}>{benefit}</li>;
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
