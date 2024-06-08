import defaultCompany from "@/assets/images/default_company.jpg";
import { Card } from "antd";

type Props = {
  job: JobType;
};
export default function CompanyInformation({ job }: Props) {
  return (
    <Card>
      <div className="flex">
        <img src={job.logo || defaultCompany} className="w-20 h-auto" />
        <div className="font-bold text-[500] text-[20px] pl-4">{job.company}</div>
      </div>
    </Card>
  );
}
