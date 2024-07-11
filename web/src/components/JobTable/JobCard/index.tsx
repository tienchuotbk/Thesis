import { getLogoSrc } from "@/helpers/job.helper";
import { Card, Divider, Flex, Image, Tag } from "antd";
import { useNavigate } from "react-router-dom";
interface IProps {
  jobInfo: any;
}
export default function JobCard({ jobInfo }: IProps) {
  const navigate = useNavigate();
  function getSalaryText(salary: any) {
    let text: any;
    switch (salary.type) {
      case 0:
        text = (
          <p className="text-sky-500 font-semibold text-base">
            Không có dữ liệu
          </p>
        );
        break;
      case 1:
        text = (
          <p className="text-blue-500 font-semibold text-base">
            {salary.min} Triệu -{salary.max} Triệu
          </p>
        );
        break;
      case 2:
        text = (
          <p className="text-sky-500 font-semibold text-base">
            {salary.fixed} Triệu
          </p>
        );
        break;
      case 3:
        text = (
          <p className="text-sky-500 font-semibold text-base">Thảo thuận</p>
        );
        break;
      case 4:
        text = (
          <p className="text-sky-500 font-semibold text-base">
            Lên đến {salary.max} Triệu
          </p>
        );
        break;
      case 5:
        text = (
          <p className="text-sky-500 font-semibold text-base">
            Trên {salary.min} Triệu
          </p>
        );
        break;
      default:
        text = <p>None</p>;
    }
    return text;
  }

  return (
    <Card className="min-h-48 shadow-md" bordered={true} style={{ width: "100%"}}>
      <div style={{ height: "60%" }}>
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
      <Flex gap="small" align="center" justify="flex-end" style={{paddingTop: "1rem"}}>
        <p className="text-blue-500">Lương:</p>
        <p>{getSalaryText(jobInfo.salary)}</p>
      </Flex>
      </div>
      <Divider />
      <div style={{ height: "35%" }}>
      <Flex wrap align="center">
        {jobInfo.category?.map((tag: string) => (
          <Tag key={tag} className="mt-[8px]">
            {tag}
          </Tag>
        ))}
      </Flex>
      </div>
    </Card>
  );
}
