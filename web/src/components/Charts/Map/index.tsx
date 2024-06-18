import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsMap from "highcharts/modules/map";
import topology from "@/const/topology";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
HighchartsMap(Highcharts);

export default function HighcharMap({
  loading,
  title,
  subtitle,
  data,
  colorMin,
  colorMax,
  maxValue,
  minValue,
  yTitle
}: {
  loading: boolean,
  title: string;
  subtitle: string;
  data: any;
  colorMin: string;
  colorMax: string;
  maxValue: number;
  minValue: number;
  yTitle: string
}) {
  const options = {
    chart: {
      map: topology,
    },

    title: {
      text: title,
    },

    subtitle: {
      text: subtitle,
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        // verticalAlign: "bottom",
        alignTo: 'spacingBox',
        x: 10
      },
    },
    colorAxis: {
      min: minValue,
      max: maxValue,
      stops: [
        [0, colorMin],
        [1, colorMax],
      ],
      labels: {
        format: "{value}",
      },
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom'
    },
    // width: "80vw",
    colors: "#786c3a",
    series: [
      {
        // Specify the series data
        data: data,
        name: yTitle,
        states: {
          hover: {
            color: "#a4edba",
          },
        },
        // type: "area",
        ataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
      // }]
    ],
  };

  return (
    <>
      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={options}
        />
      )}
    </>
  );
}
