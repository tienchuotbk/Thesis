import {
  Alert,
  Breadcrumb,
  Col,
  Flex,
  Layout,
  Menu,
  Pagination,
  Row,
  Select,
  Spin,
  Typography,
  Empty,
  theme,
} from "antd";
import JobCard from "./JobCard";
import Search from "./Search";
import Filter from "./Filter";
import type { MenuProps } from "antd";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";

export default function JobTable() {
  type MenuItem = Required<MenuProps>["items"][number];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalCount: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: null,
      role: null,
      sex: null,
      exp: null,
      age: null,
      salary: undefined,
      level: null,
      carrer: null,
    },
  });

  const handleChangePage = useCallback(
    (val: number) => {
      setPagination({ ...pagination, currentPage: val });
    },
    [pagination]
  );

  async function getJobData(filter: any, currentPage: number, sortBy: string) {
    setLoading(true);
    try {
      const jobs = await fetch(`http://localhost:3003/api?page=${currentPage}`);
      const jobData = await jobs.json();
      if (jobData && jobs.status === 200) {
        console.log(jobData.data.jobs);
        setData(jobData.data.jobs);
        setPagination({
          currentPage: jobData.data.currentPage,
          totalPage: jobData.data.totalPage,
          totalCount: jobData.data.totalCount,
        });
        setIsFirstLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    getJobData({}, pagination.currentPage, "lastest");
  }, [pagination.currentPage]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider width={"15vw"} style={{ background: "white" }}>
        <Layout.Header />
        <Filter />
      </Layout.Sider>
      <Layout>
        <Layout.Header>
          <Search />
        </Layout.Header>
        <Layout.Content style={{ margin: "0 16px" }}>
          <Flex align="flex-start" justify="space-between">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Jobs</Breadcrumb.Item>
              <Breadcrumb.Item>
                Showing {data.length}/{pagination.totalCount} jobs
              </Breadcrumb.Item>
            </Breadcrumb>
            <Flex
              style={{ marginTop: "1em", marginRight: "2em" }}
              align="center"
              justify="space-between"
              gap="small"
            >
              <p>Sort by </p>
              <Select
                defaultValue="lastest"
                options={[
                  { value: "lastest", label: "Lastest " },
                  { value: "fit", label: "Relevant" },
                  { value: "salary", label: "Salary" },
                ]}
              />
            </Flex>
          </Flex>
          {loading ? (
            <Spin tip="Loading...">
              <Alert
                message="Fetching data"
                description="This may takes several second. Calm down!"
                type="info"
                // style={{ display:"flex", alignContent: "center" }}
              />
            </Spin>
          ) : data.length ? (
            <div
              style={{
                padding: 24,
                // minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Row gutter={16}>
                {data.map((job: any) => {
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
                  total={pagination.totalPage * 10}
                />
              </div>
            </div>
          ) : (
            <Empty style={{ marginTop: "4em" }}/>
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
