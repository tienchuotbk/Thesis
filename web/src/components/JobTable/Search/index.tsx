import { careerOptions } from "@/const/options";
import provinces from "@/const/province";
import useDebounce from "@/hooks/useDebounce";
import { selectFilter, setFilter } from "@/redux/slice/filter.slice";
import { Button, Col, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
interface ChildComponentProps {
  getJobData: Function;
  loading: boolean;
}

const Search: React.FC<ChildComponentProps> = ({ getJobData, loading }) => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const [search, setSearch] = useState("");
  const valueDebounce = useDebounce(search, 800);

  useEffect(() => {
    dispatch(setFilter({ text: valueDebounce }));
  }, [valueDebounce]);

  useEffect(()=> {
    setSearch(filter.text);
  }, [filter.text]);

  const handleChangeLocation = (value: string) => {
    dispatch(
      setFilter({
        province: value,
      })
    );
  };

  const handleChangeTextInput = (event: any) => {
    setSearch(event.target.value);
  };

  const handleChangeCareer = (value: any) => {
    dispatch(
      setFilter({
        career: value,
      })
    );
  };

  const src = "location.svg";
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="">
      <Row gutter={24}>
        <Col span={10} className="w-full">
          <Input
            placeholder="Nhập thông tin bạn muốn tìm kiếm"
            className="bg-white placeholder-black"
            variant="outlined"
            value={search}
            onChange={handleChangeTextInput}
          />
          {/* </div> */}
        </Col>
        <Col span={5}>
          <Select
            className="w-full border-gray-300 border-[ rounded-md"
            onChange={handleChangeCareer}
            options={careerOptions}
            value={filter.career}
            defaultValue={""}
            filterOption={filterOption}
            showSearch
          />
        </Col>
        <Col span={5}>
          <Select
            className="w-full border-gray-300 border-[ rounded-md"
            suffixIcon={<img src={src} height={17} width={17}></img>}
            placeholder=""
            onChange={handleChangeLocation}
            options={provinces}
            filterOption={filterOption}
            value={filter.province}
            defaultValue={"all"}
            showSearch
          />
        </Col>
        <Col span={3}>
          <Button type="primary" loading={loading} iconPosition="end" onClick={() => getJobData()}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default Search;
