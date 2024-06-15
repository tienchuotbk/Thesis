import { Card, Image, Typography } from "antd";

type Props = {
  job: JobType;
};
import salarySvg from "@/assets/svg/salary.svg";
import { ClockCircleOutlined } from "@ant-design/icons";
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
                {job.salary.min} - {job.salary.max} triệu
              </div>
            </div>
          </div>
          <div className="flex flex-1">
            <Image src={salarySvg} className="job-detail__info--section-icon" preview={false} />
            <div className="pl-4">
              <div>Địa điểm</div>
              <div className="font-bold">{job.location[0].province}</div>
            </div>
          </div>
          <div className="flex flex-1">
            <Image src={salarySvg} className="job-detail__info--section-icon" preview={false} />
            <div className="pl-4">
              <div>Kinh nghiệm</div>
              <div className="font-bold">{job.experience.max} năm</div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mt-6 bg-[#f2f4f5] text-[#263a4d] flex py-[2px] px-2 rounded">
            <ClockCircleOutlined />
            <span className="ml-2">
              Hạn nộp hồ sơ: {new Date(job.expiration).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
      <Card className="mt-4">
        <Typography.Text className="text-[20px] font-[600] border-l-[6px] border-[#00b14f] pl-3">
          Chi tiết tin tuyển dụng
        </Typography.Text>

        <div className="font-[500] text-[18px] mt-4">Mô tả công việc</div>
        {job.description.length && (
          <ul className="list-disc ml-8">
            {job.description.map((description) => {
              return <li>{description}</li>;
            })}
          </ul>
        )}

        <div className="font-[500] text-[18px] mt-4"> Yêu cầu ứng viên</div>
        {job.requirement.length && (
          <ul className="list-disc ml-8">
            {job.requirement.map((requirement) => {
              return <li>{requirement}</li>;
            })}
          </ul>
        )}

        <div className="font-[500] text-[18px] mt-4"> Quyền lợi</div>
        {job.benefit.length && (
          <ul className="list-disc ml-8">
            {job.benefit.map((benefit) => {
              return <li>{benefit}</li>;
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
