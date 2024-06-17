import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function LineChart({
  title,
  subtitle,
  align,
  series,
  yTitle,
  xTitle,
  start,
  interval
}: {
  title: string;
  subtitle: string;
  align: string;
  yTitle: string,
  xTitle: string,
  start: number,
  interval: number
  series: { name: string, data: number[] }[];
}) {
  const options = {
    title: {
      text: title,
      align: align,
    },

    subtitle: {
      text: subtitle,
      align: align,
    },

    yAxis: {
      title: {
        text: yTitle,
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 16 to 60",
      },
      title: {
        text: xTitle,
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: start,
        pointInterval: interval
      },
    },

    series: series,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
