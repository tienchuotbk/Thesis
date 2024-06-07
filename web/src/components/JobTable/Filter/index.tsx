import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Select,
  Slider,
} from "antd";
import React, { useCallback, useState } from "react";
import type { SliderSingleProps } from "antd";
import { careerOptions, defaultFilter, expOptions, levelOptions, roleOptions, sexOptions, typeOptions } from "@/const/options";
interface ChildComponentProps {
  setData: React.Dispatch<React.SetStateAction<any>>;
  filter: any
}

const Filter: React.FC<ChildComponentProps> = ({ filter, setData }) => {
  const [salaryChecked, setSalaryChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const handleClearAll = () => {
    setData(defaultFilter);
  };
  const marks: SliderSingleProps["marks"] = {
    16: "16",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
  };
  const salaryMarks: SliderSingleProps["marks"] = {
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "Trên 50",
  };
  const handleChangeType = (value: any) => {
    setData((preData: any)=> ({...preData, type: value}));
  };

  const handleChangeCareer = (value: any) => {
    setData((preData: any)=> ({...preData, career: value}));
  };

  const handleChangeRole = useCallback((value: any) => {
    setData((preData: any)=> ({...preData, role: value}));
  }, []);

  const handleChangeSex = useCallback((value: any) => {
    setData((preData: any)=> ({...preData, sex: value}));
  }, []);

  const handleChangeExp = useCallback((value: any) => {
    setData((preData: any)=> ({...preData, exp: value}));
  }, []);

  const handleChangeAge = useCallback((value: any) => {
    setData((preData: any)=> ({...preData, age: value}));
  }, []);

  const handleChangeSalary = useCallback((value: any) => {
    setData((preData: any)=> ({...preData, salary: value}));
  }, []);

  const handleChangeLevel = useCallback((value: any) => {
    setData((preData: any)=> ({...preData, level: value}));
  }, []);

  const onChangeDisplaySalary = useCallback(
    () => {
      if (!salaryChecked) {
        setData((preData: any)=> ({...preData, salary: undefined}));
      }
      setSalaryChecked(!salaryChecked);
    },
    [salaryChecked]
  );

  const onChangeDisplayAge = useCallback(
    () => {
      if (!ageChecked) {
        setData((preData: any)=> ({...preData, age: undefined}));
      }
      setAgeChecked(!ageChecked);
    },
    [ageChecked]
  );

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
      </Flex>
      <Divider style={{ margin: "24px 0 12px 0" }}/>
      <Flex vertical>
        <p>Loại việc làm</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeType}
          options={typeOptions}
          value={filter.type}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Ngành nghề</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeCareer}
          options={careerOptions}
          value={filter.career}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Chức vụ</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeRole}
          options={roleOptions}
          value={filter.role}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Giới tính</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeSex}
          options={sexOptions}
          value={filter.sex}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Kinh nghiệm</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeExp}
          options={expOptions}
          value={filter.exp}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
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
            onChange={handleChangeAge}
          />
        ) : null}
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Trình độ</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeLevel}
          options={levelOptions}
          value={filter.level}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
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
            onChange={handleChangeSalary}
          />
        ) : null}
      </Flex>
    </div>
  );
}
export default Filter;
