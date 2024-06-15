import { defaultFilter } from "@/const/options";
import JobApi from "@/network/job";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Breadcrumb,
  Col,
  Empty,
  Flex,
  Layout,
  Pagination,
  Row,
  Select,
  Spin,
  theme,
} from "antd";
import { useCallback, useState } from "react";
import Filter from "./Filter";
import JobCard from "./JobCard";
import Search from "./Search";

const typedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export default function JobTable() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 10,
    totalCount: 0,
  });

  const [filter, setFilter] = useState(defaultFilter);
  const [order, setOrder] = useState("lastest");

  const { isPending, data: dataQuery } = useQuery({
    queryKey: ["fetchListJob", pagination, filter, order],
    queryFn: async () => {
      let filtered: any = {};
      typedKeys(filter).map((val) => {
        if (val === "text" || val === "career") {
          if (filter[val] !== "") {
            filtered[val.toString()] = filter[val];
          }
        } else if (val === "province") {
          if (filter[val] !== "all") {
            filtered[val.toString()] = filter[val];
          }
        } else if (filter[val] != null || filter[val] != undefined) {
          filtered[val.toString()] = filter[val];
        }
      });

      const configParams = {
        page: pagination.currentPage,
        order: order,
        limit: pagination.pageSize,
        ...filtered,
      };
      const responseData = await JobApi.getAll({ params: configParams });

      if (responseData?.data?.jobs?.length) {
        setPagination((pagination) => ({
          ...pagination,
          currentPage: responseData.data.currentPage,
          totalPage: responseData.data.totalPage,
          totalCount: responseData.data.totalCount,
        }));
        return responseData.data.jobs;
      } else {
        return null;
      }
    },
  });
  console.log(dataQuery);
  const handleChangePage = useCallback(
    (val: number) => {
      setPagination({ ...pagination, currentPage: val });
    },
    [pagination]
  );

  const handleChangeOrder = useCallback((val: string) => {
    setOrder(val);
  }, []);

  function handleSearch() {
    setPagination({ ...pagination, currentPage: 1 });
  }

  function handlePageSizeChange(_page: number, pageSize: number) {
    setPagination({ ...pagination, pageSize });
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider width={"15vw"} style={{ background: "white", position: "sticky" }}>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
          }}
        />
        <Filter filter={filter} setData={setFilter} />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
          }}
        >
          <Search
            filter={filter}
            setFilter={setFilter}
            getJobData={handleSearch}
            loading={isPending}
          />
        </Layout.Header>
        <Layout.Content style={{ margin: "0 16px" }}>
          <Flex align="flex-start" justify="space-between">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Tất cả việc làm</Breadcrumb.Item>
              <Breadcrumb.Item>
                Hiển thị <strong>{dataQuery?.length}</strong>/
                <strong>{pagination.totalCount}</strong> việc làm
              </Breadcrumb.Item>
            </Breadcrumb>
            <Flex
              style={{ marginTop: "1em", marginRight: "2em" }}
              align="center"
              justify="space-between"
              gap="small"
            >
              <p>Sắp xếp theo </p>
              <Select
                defaultValue="lastest"
                options={[
                  { value: "lastest", label: "Mới nhất" },
                  { value: "fit", label: "Phù hợp nhất" },
                  { value: "title", label: "Tên" },
                ]}
                onChange={handleChangeOrder}
                value={order}
              />
            </Flex>
          </Flex>
          {isPending ? (
            <Spin tip="Loading...">
              <Alert
                message="Fetching data"
                description="This may takes several second. Calm down!"
                type="info"
              />
            </Spin>
          ) : dataQuery?.length ? (
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Row gutter={16}>
                {dataQuery?.map((job: any) => {
                  return (
                    <Col key={job._id} span={6} className="mb-4">
                      <JobCard jobInfo={job} />
                    </Col>
                  );
                })}
              </Row>
              <div style={{ justifyContent: "center", display: "flex" }}>
                <Pagination
                  defaultCurrent={1}
                  current={pagination.currentPage}
                  onChange={handleChangePage}
                  onShowSizeChange={handlePageSizeChange}
                  total={pagination.totalPage * 10}
                />
              </div>
            </div>
          ) : (
            <Empty className="mt-[4rem]" />
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
