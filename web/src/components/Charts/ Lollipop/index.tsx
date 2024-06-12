import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function LollipopChart({
  title,
  subtitle,
  yTitle,
  data,
}: {
  title: string;
  subtitle: string;
  yTitle: String;
  data: any[];
}) {
  const options = {
    chart: {
        type: 'lollipop',
      },
    
      accessibility: {
        point: {
          valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
        }
      },
    
      legend: {
        enabled: false
      },
    
      subtitle: {
        text: subtitle
      },
    
      title: {
        text: title
      },
    
      tooltip: {
        shared: true
      },
    
      xAxis: {
        type: 'category'
      },
    
      yAxis: {
        title: {
          text: yTitle
        }
      },
    
      series: [{
        name: 'Population',
        data: [{
          name: 'China',
          y: 1444216107
        }, {
          name: 'India',
          y: 1393409038
        }, {
          name: 'United States',
          y: 332915073
        }, {
          name: 'Indonesia',
          y: 276361783
        }, {
          name: 'Pakistan',
          y: 225199937
        }, {
          name: 'Brazil',
          y: 213993437
        }, {
          name: 'Nigeria',
          y: 211400708
        }, {
          name: 'Bangladesh',
          y: 166303498
        }, {
          name: 'Russia',
          y: 145912025
        }, {
          name: 'Mexico',
          y: 130262216
        }]
      }]
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
