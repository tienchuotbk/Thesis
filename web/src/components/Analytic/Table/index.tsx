import { Layout, Breadcrumb, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import TableChart from "@/components/Charts/Table";
import { useQuery } from "@tanstack/react-query";
import AnalysisApi from "@/network/analysis";
import { experienceMap, fieldsMap, rolesMap } from "@/const";

const TableAnalysis = () => {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchTableData"],
    queryFn: async () => {
      const configParams = {};
      const responseData = await AnalysisApi.getTable({ params: configParams });
      if (responseData?.data) {
        return responseData.data;
      } else {
        return null;
      }
    },
  });

  const salaryByFieldData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    dataQuery?.field_count_salary?.map((val: any) => {
      arrTitle.push(fieldsMap.get(val.field_name) || "");
      arrValue.push(parseFloat(val.average_salary.toFixed(2)));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  const roleCountData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    dataQuery?.role_count?.map((val: any) => {
      arrTitle.push(rolesMap.get(val.role) || "");
      arrValue.push(parseInt(val.count));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  const expCountData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    Object.keys(dataQuery ? dataQuery.exp_count : {}).map((val: string) => {
      arrTitle.push(experienceMap.get(val) || "");
      arrValue.push(parseInt(dataQuery?.exp_count[val]));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  const fieldCountData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    dataQuery?.field_count_salary?.map((val: any) => {
      arrTitle.push(fieldsMap.get(val.field_name) || "");
      arrValue.push(parseInt(val.count));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  return (
    <Layout
      title="Table Chart"
      // style={{ backgroundColor: colorBgLayout, paddingBottom: "2em" }}
    >
      <Layout.Header
        style={{
          backgroundColor: colorBgBase,
          borderTop: "2px",
          padding: "0.5em",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>Job Visualization</Breadcrumb.Item>
          <Breadcrumb.Item>table chart</Breadcrumb.Item>
          <h2>Heaher ne</h2>
        </Breadcrumb>
      </Layout.Header>
      <Layout.Content>
        <TableChart
          title="Average salary by field"
          data={salaryByFieldData}
          subtitle="Hihi"
          description="Heloo nha"
          align="center"
          yText="Luong"
          valueSuffix=" Trieu"
          color={"#1af057"}
        />
        <TableChart
          title="Total jobs by role"
          data={roleCountData}
          subtitle="Hihi"
          description="Heloo nha"
          align="center"
          yText="So luong cong viec"
          valueSuffix=" viec lam"
          color={"#14e34f"}
        />
        <TableChart
          title="So luong cong viec theo kinh nghiem"
          data={expCountData}
          subtitle="Hihi"
          description="Heloo nha"
          align="center"
          yText="So luong cong viec"
          valueSuffix=" viec lam"
          color={"#14e34f"}
        />
        <TableChart
          title="Total jobs by field"
          data={fieldCountData}
          subtitle="Hihi"
          description="Heloo nha"
          align="center"
          yText="So luong cong viec"
          valueSuffix=" viec lam"
          color={"#14e34f"}
        />
      </Layout.Content>
    </Layout>
  );
};
export default TableAnalysis;
