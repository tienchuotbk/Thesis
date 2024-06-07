import { filterInterface } from "@/const/options";
import provinces from "@/const/province";
import { Button, Col, Input, Row, Select, SelectProps } from "antd";
import { useCallback, useState } from "react";
interface ChildComponentProps {
  setFilter: React.Dispatch<React.SetStateAction<any>>;
  filter: filterInterface,
  getJobData: Function,
  loading: boolean,
}

const Search: React.FC<ChildComponentProps> = ({ filter, setFilter, getJobData, loading }) => {
  const handleChangeLocation = (value: string) => {
    console.log(value)
    setFilter((preVal: any) => ({... preVal, province: value}))
  };

  const handleChangeTextInput = (event: any) => {
    setFilter((preVal: any) => ({... preVal, text: event.target.value}))
  };

  const src = "location.svg";
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="">
      <Row gutter={20}>
        <Col span={15} className="w-full">
          {/* <div className="border-gray-300 border-[1px] rounded-md"> */}
          <Input
            placeholder="Nhập thông tin bạn muốn tìm kiếm"
            className="bg-white placeholder-black"
            variant="outlined"
            value={filter.text}
            onChange={handleChangeTextInput}
          />
          {/* </div> */}
        </Col>
        <Col span={5}>
          <Select
            className="w-full border-gray-300 border-[ rounded-md"
            suffixIcon={<img src={src} height={17} width={17}></img>}
            placeholder=""
            onChange={handleChangeLocation}
            options={provinces}
            filterOption={filterOption}
            defaultValue={"all"}
            showSearch
          />
        </Col>
        <Col span={3}>
          <Button type="primary" loading={loading} iconPosition="end" onClick={()=> getJobData(true)}>
            Search
          </Button>
        </Col>
      </Row>
    </div>
  );
}
export default Search;
