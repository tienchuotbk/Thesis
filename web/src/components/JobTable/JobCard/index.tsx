import { getLogoSrc } from "@/helpers/job.helper";
import { Card, Divider, Flex, Image, Tag } from "antd";
import { useNavigate } from "react-router-dom";
interface IProps {
  jobInfo: any;
}
export default function JobCard({ jobInfo }: IProps) {
  console.log(jobInfo)
  const navigate = useNavigate();
  function getSalaryText(salary: any) {
    let text: any;
    switch (salary.type) {
      case 0:
        text = <p className="text-sky-500 font-semibold text-base">Không có dữ liệu</p>;
        break;
      case 1:
        text = (
          <p className="text-blue-500 font-semibold text-base">
            {salary.min} Triệu -{salary.max} Triệu
          </p>
        );
        break;
      case 2:
        text = <p className="text-sky-500 font-semibold text-base">{salary.fixed} Triệu</p>;
        break;
      case 3:
        text = <p className="text-sky-500 font-semibold text-base">Lên đến {salary.max} Triệu</p>;
        break;
      case 4:
        text = <p className="text-sky-500 font-semibold text-base">Trên {salary.min} Triệu</p>;
        break;
      case 5:
        text = <p className="text-sky-500 font-semibold text-base">Thảo thuận</p>;
        break;
      default:
        text = <p>None</p>;
    }
    return text;
  }

  return (
    <Card className="min-h-48" bordered={true}>
      <Flex justify="space-start" gap={"middle"}>
        <Image width={"4.5em"} src={getLogoSrc(jobInfo.logo)} preview={false} />
        <Flex justify="space-start" gap="small" vertical>
          <p
            className="font-bold text-slate-700 cursor-pointer hover:text-[#69b1ff]"
            onClick={() => navigate("/job/" + jobInfo._id)}
          >
            {jobInfo.title}
          </p>
          <div className="text-xs">{jobInfo.company}</div>
        </Flex>
      </Flex>
      <Flex gap="small" align="center" justify="flex-end">
        <p className="text-blue-500">Lương:</p>
        {getSalaryText(jobInfo.salary)}
      </Flex>
      <Divider />
      <Flex gap={4} wrap align="center">
        {/* <span>Categories:</span> */}
        {jobInfo.category?.map((tag: string) => (
          <Tag
            key={tag}
            // onChange={(checked) => handleChange(tag, checked)}
          >
            {tag}
          </Tag>
        ))}
      </Flex>
    </Card>
  );
}
