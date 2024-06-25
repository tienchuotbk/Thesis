import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function TableChart({
  title,
  subtitle,
  align,
  data,
  description,
  yText,
  valueSuffix,
  color
}: {
  title: string;
  subtitle: string;
  align: string;
  data: {
    x_title: string[],
    value: number[]
  };
  yText: string;
  description: string,
  valueSuffix: string,
  color: string
}) {
  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: title,
      align: align
    },
    subtitle: {
      text: subtitle,
      align: align
    },
    xAxis: {
      categories: data.x_title,
      crosshair: true,
      accessibility: {
        description: description
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: yText,
      }
    },
    tooltip: {
      valueSuffix: valueSuffix
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    // colors: "#ebac1a",
    series: [
      {
        name: description,
        data: data.value
      }
    ]
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
