import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function LineChart({
  title,
  subtitle,
  align,
  data,
}: {
  title: string;
  subtitle: string;
  align: string;
  data: any[];
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
        text: "Number of Employees",
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 16 to 60",
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
        pointStart: 16,
        // pointRange: ,
        pointInterval: 1
      },
    },

    series: [
      {
        name: "Number of jobs",
        data: data,
      },
      
    ],

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
