// LollipopChart.js
import Highcharts, { Series } from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LollipopChart = () => {
  const options = {
    chart: {
      type: "lollipop",
      inverted: true,
    },
    accessibility: {
      point: {
        valueDescriptionFormat: "{index}. {xDescription}, {point.y}.",
      },
    },
    title: {
      text: "Lollipop Chart Example",
    },
    tooltip: {
      shared: true,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "category",
    },

    yAxis: {
      title: {
        text: "Population",
      },
    },
    series: [
      {
        name: "Lollipops",
        type: "line",
        data: [
          {
            name: "China",
            y: 174634632,
          },
          {
            name: "India",
            y: 167463243,
          },
          {
            name: "CPC",
            y: 197372263,
          },
          {
            name: "Malaysis",
            y: 127432553,
          },
          {
            name: "Philip",
            y: 137837662,
          },
        ],
        // marker: {
        //   symbol: "circle",
        //   radius: 6,
        // },
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={ options } />
    </div>
  );
};

export default LollipopChart;
