import provinces from "@/const/province";
import { Button, Col, Input, Row, Select, SelectProps } from "antd";

export default function Search() {
  const handleChange = (value: string) => {};
  const options: SelectProps["options"] = [];

  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }
  const src = "location.svg";

  return (
    <div className="">
      <Row gutter={20}>
        <Col span={15} className="w-full">
          {/* <div className="border-gray-300 border-[1px] rounded-md"> */}
          <Input
            placeholder="Nhập thông tin bạn muốn tìm kiếm"
            className="bg-white placeholder-black"
            variant="outlined"
          />
          {/* </div> */}
        </Col>
        <Col span={5}>
          <Select
            className="w-full border-gray-300 border-[ rounded-md"
            prefixCls="HUHU"
            suffixIcon={<img src={src} height={17} width={17}></img>}
            placeholder=""
            onChange={handleChange}
            options={provinces}
          />
        </Col>
        <Col span={3}>
          <Button type="primary" loading={true} iconPosition="end">Search</Button>
        </Col>
      </Row>
    </div>
  );
}
