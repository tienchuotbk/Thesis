import { getLogoSrc } from "@/helpers/job.helper";
import { Card, Col, Image, Row } from "antd";
import "react-multi-carousel/lib/styles.css";

interface Iprops {
  companies: CompanyType[];
}
export default function CarouselJob({ companies }: Iprops) {
  return (
    <Row gutter={24}>
      {companies.map((company) => {
        return (
          <Col span={8} key={company._id}>
            <Card className="m-2 select-none cursor-pointer">
              <div className="flex flex-col">
                <div className="w-[100px] h-[100px] max-w-[100px] object-cover mr-2">
                  <Image
                    src={getLogoSrc(company.logo)}
                    preview={false}
                    className="w-[100px] h-[100px] max-w-[100px] object-cover"
                    style={{ width: "100px", height: "100px", objectFit: "contain" }}
                  />
                </div>
                <div className="text-base font-bold">{company.name}</div>
              </div>
              <div className="mt-2">Số việc đăng tuyển: {company.numberJob}</div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
