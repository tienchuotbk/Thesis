import { getLogoSrc } from "@/helpers/job.helper";
import { Card } from "antd";

type Props = {
  job: JobType;
};
export default function CompanyInformation({ job }: Props) {
  return (
    <Card>
      <div className="flex sm:flex-col md:flex-col lg:flex-col xl:flex-row">
        <div className="max-w-[88px]">
          <img src={getLogoSrc(job.logo)} className="w-full h-auto" />
        </div>
        <div className="font-[500] text-[20px] pl-4">{job.company}</div>
      </div>
      <div className="mt-4">
        <div className="mt-2 flex sm:flex-col md:flex-col lg:flex-col xl:flex-row">
          <div className="text-[#7f878f] min-w-24 font-[400]">Quy mô: </div>
          <div className="font-[500] text-[#212f3f]">100 - 499 nhân viên</div>
        </div>
        <div className="mt-2 flex sm:flex-col md:flex-col lg:flex-col xl:flex-row">
          <div className="text-[#7f878f] min-w-24 font-[400]">Địa điểm: </div>
          <div className="font-[500] text-[#212f3f]">
            {job.location[0].address}, {job.location[0].district}, {job.location[0].province}
          </div>
        </div>
      </div>
    </Card>
  );
}
