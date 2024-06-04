import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Row } from "antd";
import { useState } from "react";

export default function Filter() {
  const [jobType, setJobType] = useState(true);
  const handleClearAll = () => {};
  const handleJobTypeClick = () => {
    setJobType((prev) => !prev);
  };
  return (
    <div className="text-base">
      <Row
        justify={"space-between"}
        align="middle"
        className="border-b-[1px] pb-2 px-2 border-[#ccc] mb-4"
      >
        <Col span={12}>
          <span className="font-bold text-base">Filter</span>
        </Col>
        <Col span={12} className="flex justify-end">
          <Button type="link" onClick={handleClearAll} className="font-bold">
            Clear All
          </Button>
        </Col>
      </Row>
      <div className="w-full flex justify-between pr-4 cursor-pointer" onClick={handleJobTypeClick}>
        <span className="font-bold">Job Type</span>
        {jobType ? <DownOutlined /> : <UpOutlined />}
      </div>
      {jobType && (
        <div className="flex flex-col text-[#ccc] text-base">
          <Checkbox>Contract</Checkbox>
          <Checkbox>Fulltime</Checkbox>
          <Checkbox>Part-Time</Checkbox>
          <Checkbox>Intership</Checkbox>
        </div>
      )}
    </div>
  );
}
