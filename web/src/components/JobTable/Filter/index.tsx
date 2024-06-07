import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Select,
  Slider,
} from "antd";
import { useCallback, useState } from "react";
import type { SliderSingleProps } from "antd";
import { Controller } from "react-hook-form";

export default function Filter() {
  const [type, setType] = useState(null);
  const [role, setRole] = useState(null);
  const [sex, setSex] = useState(null);
  const [exp, setExp] = useState(null);
  const [age, setAge] = useState(undefined);
  const [salary, setSalary] = useState(undefined);
  const [level, setLevel] = useState(null);
  const [career, setCareer] = useState(null);
  const [salaryChecked, setSalaryChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const handleClearAll = () => {};
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
    setType(value);
  };

  const handleChangeCareer = (value: any) => {
    setCareer(value);
  };

  const handleChangeRole = useCallback((value: any) => {
    setRole(value);
  }, []);

  const handleChangeSex = useCallback((value: any) => {
    setSex(value);
  }, []);

  const handleChangeExp = useCallback((value: any) => {
    setExp(value);
  }, []);

  const handleChangeAge = useCallback((value: any) => {
    setAge(value);
  }, []);

  const handleChangeSalary = useCallback((value: any) => {
    setSalary(value);
  }, []);

  const handleChangeLevel = useCallback((value: any) => {
    setLevel(value);
  }, []);

  const onChangeDisplaySalary = useCallback(
    () => {
      if (!salaryChecked) setSalary(undefined);
      setSalaryChecked(!salaryChecked);
    },
    [salaryChecked]
  );

  const onChangeDisplayAge = useCallback(
    () => {
      if (!ageChecked) setAge(undefined);
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
          options={[
            { value: null, label: "Tất cả" },
            { value: 0, label: "Toàn thời gian cố định" },
            { value: 1, label: "Thời vụ" },
            { value: 2, label: "Partime" },
            { value: 3, label: "Hợp đồng" },
            { value: 4, label: "Thực tập" },
            { value: 5, label: "Khác" },
          ]}
          value={type}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Ngành nghề</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeCareer}
          options={[
            { value: null, label: "Tất cả" },
            { value: 1, label: "IT" },
          ]}
          value={career}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Chức vụ</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeRole}
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
          value={role}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Giới tính</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeSex}
          options={[
            { value: null, label: "Tất cả" },
            { value: 1, label: "Nam" },
            { value: 2, label: "Nữ" },
          ]}
          value={sex}
          defaultValue={null}
        />
      </Flex>
      <Divider style={{ margin: "14px 0" }}/>
      <Flex vertical>
        <p>Kinh nghiệm</p>
        <Select
          style={{ width: "90%" }}
          onChange={handleChangeExp}
          options={[
            { value: null, label: "Tất cả" },
            { value: 0, label: "Chưa có kinh nghiệm" },
            { value: 1, label: "1 năm" },
            { value: 2, label: "2 năm" },
            { value: 3, label: "3 năm" },
            { value: 4, label: "4 năm" },
            { value: 5, label: "5 năm" },
            { value: 6, label: "Trên 5 năm" },
          ]}
          value={exp}
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
            value={age}
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
          options={[
            { value: null, label: "Tất cả" },
            { value: 1, label: "Chứng chỉ" },
            { value: 2, label: "Trung học" },
            { value: 3, label: "Trung cấp" },
            { value: 4, label: "Cao đẳng" },
            { value: 5, label: "Đại học" },
            { value: 6, label: "Trên đại học" },
          ]}
          value={level}
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
            value={salary}
            onChange={handleChangeSalary}
          />
        ) : null}
      </Flex>
    </div>
  );
}
