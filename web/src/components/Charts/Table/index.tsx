import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function TableChart({
  title,
  subtitle,
  align,
  data
}: {
  title: string;
  subtitle: string;
  align: string;
  data: any[];
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
      categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
      crosshair: true,
      accessibility: {
        description: 'Countries'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '1000 metric tons (MT)'
      }
    },
    tooltip: {
      valueSuffix: ' (1000 MT)'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Corn',
        data: [406292, 260000, 107000, 68300, 27500, 14500]
      },
      {
        name: 'Wheat',
        data: [51086, 136000, 5500, 141000, 107180, 77000]
      }
    ]
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
