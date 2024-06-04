import { Col, Row, Typography } from "antd";
import JobCard from "./JobCard";
import Search from "./Search";
import Filter from "./Filter";

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
      <Row gutter={6} className="w-full">
        <Col span={6}>
          <Filter />
        </Col>
        <Col span={18}>
          <Search />
          <Typography.Text className="block text-base my-4">
            Showing <span className="text-slate-700">150</span> Jobs{" "}
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
        </Col>
      </Row>
    </div>
  );
}
