import { Button, Divider, Flex, Select } from "antd";
import React, { useCallback } from "react";
import { careerOptions, expOptions, levelOptions } from "@/const/options";
import {
  clearAnalysisFilter,
  selectFilter,
  setAnalysisFilter
} from "@/redux/slice/analysisFilter.slice";
import { useSelector, useDispatch } from "react-redux";
interface ChildComponentProps {}

const AnalysisFilter: React.FC<ChildComponentProps> = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const handleClearAll = () => {
    dispatch(clearAnalysisFilter());
  };

  const handleApplyFilter = () => {
    
  }

  const handleChangeCareer = (value: any) => {
    dispatch(setAnalysisFilter({ career: value }));
  };

  const handleChangeExp = useCallback((value: any) => {
    dispatch(setAnalysisFilter({ exp: value }));
  }, []);

  const handleChangeLevel = useCallback((value: any) => {
    dispatch(setAnalysisFilter({ level: value }));
  }, []);

  return (
    <div
      className="text-base md-4 px-4"
      style={{
        position: "sticky",
        top: 1,
        zIndex: 100,
        width: "100%",
        alignItems: "center",
        height: "fit-content",
      }}
    >
      <Button
        type="link"
        onClick={handleClearAll}
        className="font-bold md-2 pt-4"
      >
        Xóa
      </Button>
      <Divider style={{ margin: "24px 0 12px 0" }} />
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
      <Divider style={{ margin: "14px 0" }} />
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
      <Divider style={{ margin: "14px 0" }} />
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
      <Button
        type="default"
        // loading={true}
        style={{ marginTop: "2em" }}
        iconPosition="end"
        onClick={handleApplyFilter}
      >
        Áp dụng bộ lọc
      </Button>
    </div>
  );
};
export default AnalysisFilter;
