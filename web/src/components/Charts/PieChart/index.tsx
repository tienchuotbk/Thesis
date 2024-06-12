import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function PieChart({
  title,
  subtitle,
  data
}: {
  title: string;
  subtitle: string;
  data: { name: string; y: number; selected?: boolean; sliced?: boolean }[];
}) {
  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: title,
    },
    tooltip: {
      valueSuffix: "%",
    },
    subtitle: {
      text: subtitle,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [{
          enabled: true,
          distance: 20
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10
          }
        }]
      }
    },
    series: [
      {
        name: 'Percentage',
        colorByPoint: true,
        data: data
      }
    ]
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
