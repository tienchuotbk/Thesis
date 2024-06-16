import { Button, Checkbox, Divider, Flex, Select, Slider } from "antd";
import React, { useCallback, useState } from "react";
import type { SliderSingleProps } from "antd";
import {
  expOptions,
  levelOptions,
  roleOptions,
  sexOptions,
  typeOptions,
} from "@/const/options";
import { useDispatch, useSelector } from "react-redux";
import { clearFilter, defaultFilter, selectFilter, setFilter } from "@/redux/slice/filter.slice";

const Filter: React.FC = () => {
  const [salaryChecked, setSalaryChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const handleClearAll = () => {
    dispatch(clearFilter())
  };

  const marks: SliderSingleProps["marks"] = {
    16: "16",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    60: "60",
  };
  const salaryMarks: SliderSingleProps["marks"] = {
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "Trên 50",
  };

  const handleChangeFilter = (value: any, type: any) => {
    dispatch(setFilter({
      [type]: value,
    }))
  }

  const onChangeDisplaySalary = useCallback(() => {
    if (salaryChecked) {
      dispatch(setFilter({
        salary: undefined,
      }))
      // setData((preData: any) => ({ ...preData, salary: undefined }));
    }
    setSalaryChecked(!salaryChecked);
  }, [salaryChecked]);

  const onChangeDisplayAge = useCallback(() => {
    if (ageChecked) {
      dispatch(setFilter({
        age: undefined,
      }))
      // setData((preData: any) => ({ ...preData, age: undefined }));
    }
    setAgeChecked(!ageChecked);
  }, [ageChecked]);

  return (
    <div
      className="text-base md-4 px-4"
      style={{
        position: "sticky",
        top: 1,
        zIndex: 1,
        width: "100%",
        // display: 'flex',
        alignItems: "center",
        height: "fit-content",
      }}
    >
      {/* <Flex align="end" justify="space-between"> */}
      <Button
        type="link"
        onClick={handleClearAll}
        className="font-bold md-2 pt-4"
      >
        Xóa
      </Button>
      {/* </Flex> */}
      <Divider style={{ margin: "24px 0 12px 0" }} />
      <Flex vertical>
        <p>Loại việc làm</p>
        <Select
          style={{ width: "90%" }}
          id="type"
          onChange={(value) => handleChangeFilter(value, "type")}
          options={typeOptions}
          value={filter.type}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }} />
      <Flex vertical>
        <p>Chức vụ</p>
        <Select
          style={{ width: "90%" }}
          id="role"
          onChange={(value) => handleChangeFilter(value, "role")}
          options={roleOptions}
          value={filter.role}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }} />
      <Flex vertical>
        <p>Giới tính</p>
        <Select
          style={{ width: "90%" }}
          id="sex"
          onChange={(value) => handleChangeFilter(value, "sex")}
          options={sexOptions}
          value={filter.sex}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }} />
      <Flex vertical>
        <p>Kinh nghiệm</p>
        <Select
          style={{ width: "90%" }}
          id="exp"
          onChange={(value) => handleChangeFilter(value, "exp")}
          options={expOptions}
          value={filter.exp}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }} />
      <Flex vertical>
        <Checkbox onChange={onChangeDisplayAge} checked={ageChecked}>
          <p className="text-base">Tuổi</p>
        </Checkbox>
        {ageChecked ? (
          <Slider
            marks={marks}
            defaultValue={undefined}
            min={16}
            max={60}
            value={filter.age}
            id="age"
            onChange={(value) => handleChangeFilter(value, "age")}
          />
        ) : null}
      </Flex>
      <Divider style={{ margin: "14px 0" }} />
      <Flex vertical>
        <p>Trình độ</p>
        <Select
          style={{ width: "90%" }}
          id="level"
          onChange={(value) => handleChangeFilter(value, "level")}
          options={levelOptions}
          value={filter.level}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }} />
      <Flex vertical>
        <Checkbox onChange={onChangeDisplaySalary} checked={salaryChecked}>
          <p className="text-base">Mức lương</p>
        </Checkbox>
        {salaryChecked ? (
          <Slider
            marks={salaryMarks}
            defaultValue={undefined}
            min={0}
            max={50}
            value={filter.salary}
            id="salary"
            onChange={(value) => handleChangeFilter(value, "salary")}
          />
        ) : null}
      </Flex>
    </div>
  );
};
export default Filter;
