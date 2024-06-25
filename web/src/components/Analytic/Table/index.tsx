import TableChart from "@/components/Charts/Table";
import { experienceMap, fieldsMap, rolesMap } from "@/const";
import { removeNullishAttributes } from "@/helpers/job.helper";
import AnalysisApi from "@/network/analysis";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Layout, theme } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const TableAnalysis = () => {
  const filter = useSelector(selectFilter);
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchTableData", filter],
    queryFn: async () => {
      let configParams = {};
      configParams = removeNullishAttributes(filter) as any;
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
      arrValue.push(parseFloat(val.average_salary?.toFixed(2)));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  function splitArray(arr: { x_title: string[], value: number[] }) {
    // Tính toán điểm chia
    const mid = Math.ceil(arr.x_title.length / 2);
  
    // Chia array thành hai subarray
    const firstHalf = {
      x_title: arr.x_title.slice(0, mid), 
      value:  arr.value.slice(0, mid)
    }
    const secondHalf = {
      x_title: arr.x_title.slice(mid), 
      value:  arr.value.slice(mid)
    }
  
    return [firstHalf, secondHalf];
  } 

  const [salaryByFieldData1, salaryByFieldData2] = useMemo(()=> splitArray(salaryByFieldData) , [salaryByFieldData])

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

  const [fieldCountData1, fieldCountData2] = useMemo(()=> splitArray(fieldCountData) , [fieldCountData])

  return (
    <Layout title="Table Chart">
      <Layout.Header className="bg-[#ffffff]">
        <span className="text-base font-bold">Thống kê các mức lương và phân bố công việc theo từng ngành nghề, kinh nghiệm và vị trí</span>
      </Layout.Header>
      <Layout.Content className="my-[1rem]">
        <TableChart
          title="Trung bình lương theo ngành nghề (1)"
          data={salaryByFieldData1}
          subtitle=""
          description="Lương trung bình"
          align="center"
          yText="Lương"
          valueSuffix=" Triệu"
          color={"#1af057"}
        />
        <TableChart
          title="Trung bình lương theo ngành nghề (2)"
          data={salaryByFieldData2}
          subtitle=""
          description="Lương trung bình"
          align="center"
          yText="Lương"
          valueSuffix=" Triệu"
          color={"#1af057"}
        />
        <div className="mb-2"></div>
        <TableChart
          title="Số lượng công việc theo vị trí"
          data={roleCountData}
          subtitle=""
          description="Số công việc"
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
        <div className="mb-2"></div>
        <TableChart
          title="Số lượng công việc theo năm kinh nghiệm"
          data={expCountData}
          subtitle=""
          description="Số công việc"
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
        <div className="mb-2"></div>
        <TableChart
          title="Tổng số công việc theo ngành nghề (1)"
          data={fieldCountData1}
          subtitle=""
          description="Số công việc"
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
        <TableChart
          title="Tổng số công việc theo ngành nghề (2)"
          data={fieldCountData2}
          subtitle=""
          description="Số công việc"
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
      </Layout.Content>
    </Layout>
  );
};
export default TableAnalysis;
