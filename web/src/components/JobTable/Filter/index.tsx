import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Layout,
  Row,
  Select,
} from "antd";
import { useState } from "react";

export default function Filter() {
  const [jobType, setJobType] = useState(true);
  const handleClearAll = () => {};
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const handleJobTypeClick = () => {
    setJobType((prev) => !prev);
  };
  return (
    <div className="text-base md-4 px-4">
      <Flex align="end" justify="space-between">
        {/* <span className="font-bold text-base">Filter</span> */}
        <Button
          type="link"
          onClick={handleClearAll}
          className="font-bold md-2 pt-4"
        >
          Clear All
        </Button>
        {/* <p>Clear all</p> */}
      </Flex>
      <Divider />
      <Flex vertical>
        <p>Loại việc làm</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChange}
          options={[
            { value: null, label: "Tất cả" },
            { value: 0, label: "Toàn thời gian cố định" },
            { value: 1, label: "Thời vụ" },
            { value: 2, label: "Partime" },
            { value: 3, label: "Hợp đồng" },
            { value: 4, label: "Thực tập" },
            { value: 5, label: "Khác" },
          ]}
          defaultValue={null}
        />
      </Flex>
      <Divider />
      <Flex vertical>
        <p>Chức vụ</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChange}
          options={[
            { value: null, label: "Tất cả" },
            { value: 0, label: "Nhân viên/Chuyên viên" },
            { value: 1, label: "Quản lý" },
            { value: 2, label: "Giám đốc" },
            { value: 3, label: "Phó Giám đốc" },
            { value: 4, label: "Thực tập sinh" },
            { value: 5, label: "Trưởng nhóm/Giám sát" },
            { value: 6, label: "Cộng tác viên" },
            { value: 7, label: "Chuyên gia" },
          ]}
          defaultValue={null}
        />
      </Flex>
    </div>
  );
}
