import { Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
export default function Search() {
  return (
    <div className="">
      <Typography.Title level={2} className="capitalize font-black">
        find your dream job here
      </Typography.Title>
      <div className="w-9/12 p-2 rounded-full border-slate-100 border-2">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search Job Title Or Keyword"
          className="w-2/6 border-none outline-0"
          variant="borderless"
        />
      </div>
    </div>
  );
}
