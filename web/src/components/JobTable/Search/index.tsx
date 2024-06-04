import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Select, SelectProps } from "antd";

export default function Search() {
  const handleChange = (value: string) => {};
  const options: SelectProps["options"] = [];

  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }

  return (
    <div className="">
      <Row gutter={16}>
        <Col span={6} className="w-full">
          <div className="border-gray-300 border-[1px] rounded-md">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Job Title Or Keyword"
              className="bg-white placeholder-black"
              variant="borderless"
            />
          </div>
        </Col>
        <Col span={3}>
          <div className="border-gray-300 border-[ rounded-md">
            <Select
              className="w-full"
              defaultValue={"vietname"}
              onChange={handleChange}
              options={[
                { value: "vietnam", label: "vietnam" },
                { value: "indonesia", label: "indonesia" },
              ]}
            />
          </div>
        </Col>
        <Col span={6}>
          <Select
            className="w-full border-gray-300 border-[ rounded-md"
            mode="tags"
            placeholder=""
            onChange={handleChange}
            options={options}
          />
        </Col>
      </Row>
    </div>
  );
}
