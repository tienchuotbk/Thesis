import { Col, Row, Typography } from "antd";
import Search from "./Search";
import JobCard from "./JobCard";

type Data = {
  id: number;
  title: string;
  location: string;
};
const data: Data[] = [
  {
    id: 1,
    title: "UI/UX Designer",
    location: "Vietnam",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    location: "Vietnam",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    location: "Vietnam",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    location: "Vietnam",
  },
];

export default function JobTable() {
  return (
    <div className="flex ">
      <div className="w-1/6">Job Type</div>
      <div className="w-5/6">
        <Search />
        <Typography.Text className="block text-base my-4">
          Showing <span className="text
          
          -slate-700">150</span> Jobs{" "}
          <span className="text-slate-700">UI/UX Designer</span> in{" "}
          <span className="text-slate-700">Indonesia</span>
        </Typography.Text>
        <Row gutter={16}>
          {data.map((job) => {
            return (
              <Col key={job.id} span={8} className="mb-4">
                <JobCard jobInfo={job} />
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
