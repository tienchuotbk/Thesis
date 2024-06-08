import { Card, Image, Flex, Tag, Divider } from "antd";

interface IProps {
  jobInfo: any;
}
export default function JobCard({ jobInfo }: IProps) {
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
          <p className="text-sky-500 font-semibold text-base">
            Lên đến {salary.max} Triệu
          </p>
        );
        break;
      case 4:
        text = (
          <p className="text-sky-500 font-semibold text-base">
            Trên {salary.min} Triệu
          </p>
        );
        break;
      case 5:
        text = (
          <p className="text-sky-500 font-semibold text-base">Thảo thuận</p>
        );
        break;
      default:
        text = <p>None</p>;
    }
    return text;
  }

  return (
    <Card className="min-h-48" bordered={false}>
      <Flex justify="space-start" gap={"middle"}>
        <Image
          width={"4.5em"}
          src={jobInfo.logo}
        />
        <Flex justify="space-start" gap="small" vertical>
          <a className="font-bold text-slate-700" href={"/job/"+ jobInfo._id}>{jobInfo.title}</a>
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
        {jobInfo.category.map((tag: string) => (
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
