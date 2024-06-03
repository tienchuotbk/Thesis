import { Card } from "antd";

interface IProps {
  jobInfo: any;
}
export default function JobCard({ jobInfo }: IProps) {
  return (
    <Card className="min-h-48">
      <div className="font-bold text-slate-700">{jobInfo.title}</div>
    </Card>
  );
}
