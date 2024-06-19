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
import { useCallback, useEffect, useRef, useState } from "react";
import Filter from "./Filter";
import JobCard from "./JobCard";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { selectPagination, setPagination } from "@/redux/slice/pagination.slice";
import { selectFilter } from "@/redux/slice/filter.slice";

const typedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export default function JobTable() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();

  const [order, setOrder] = useState("lastest");

  const pagination = useSelector(selectPagination);
  const filter = useSelector(selectFilter);

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

      if (responseData.data) {
        return responseData.data;
      }
    },
  });

  useEffect(() => {
    if (dataQuery) {
      dispatch(
        setPagination({
          currentPage: dataQuery.currentPage,
          totalPage: dataQuery.totalPage,
          totalCount: dataQuery.totalCount,
        })
      );
    }
  }, [dataQuery]);

  const handleChangePage = useCallback((val: number) => {
    dispatch(
      setPagination({
        currentPage: val,
      })
    );
  }, []);

  const handleChangeOrder = useCallback((val: string) => {
    setOrder(val);
  }, []);

  function handleSearch() {
    dispatch(setPagination({ currentPage: 1 }));
  }

  const handlePageSizeChange = useCallback((_page: number, pageSize: number) => {
    dispatch(
      setPagination({
        pageSize: pageSize,
      })
    );
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider width={"15vw"} style={{ background: "white", position: "sticky", zIndex: 100 }}>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
            backgroundColor: "#02054d",
          }}
        />
        <Filter />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
            backgroundColor: "#02054d",
          }}
        >
          <Search getJobData={handleSearch} loading={isPending} />
        </Layout.Header>
        <Layout.Content className="mx-4">
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
          ) : dataQuery?.jobs.length ? (
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Row gutter={16}>
                {dataQuery?.jobs.map((job: any) => {
                  return (
                    <Col key={job._id} xs={24} sm={12} md={8} lg={6} className="mb-4">
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
                  pageSize={pagination.pageSize}
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
