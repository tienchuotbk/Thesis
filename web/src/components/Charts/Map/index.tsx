import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import HighchartsMap from "highcharts/modules/map";
HighchartsMap(Highcharts);

export default function HighcharMap() {
  const [topology, setTopology] = useState([]);

  const data = [
    ["vn-3655", 10],
    ["vn-qn", 11],
    ["vn-kh", 12],
    ["vn-tg", 13],
    ["vn-bv", 14],
    ["vn-bu", 15],
    ["vn-hc", 16],
    ["vn-br", 17],
    ["vn-st", 18],
    ["vn-pt", 19],
    ["vn-yb", 20],
    ["vn-hd", 21],
    ["vn-bn", 22],
    ["vn-317", 23],
    ["vn-nb", 24],
    ["vn-hm", 25],
    ["vn-ho", 26],
    ["vn-vc", 27],
    ["vn-318", 28],
    ["vn-bg", 29],
    ["vn-tb", 30],
    ["vn-ld", 31],
    ["vn-bp", 32],
    ["vn-py", 33],
    ["vn-bd", 34],
    ["vn-724", 35],
    ["vn-qg", 36],
    ["vn-331", 37],
    ["vn-dt", 38],
    ["vn-la", 39],
    ["vn-3623", 40],
    ["vn-337", 41],
    ["vn-bl", 42],
    ["vn-vl", 43],
    ["vn-tn", 44],
    ["vn-ty", 45],
    ["vn-li", 46],
    ["vn-311", 47],
    ["vn-hg", 48],
    ["vn-nd", 49],
    ["vn-328", 50],
    ["vn-na", 51],
    ["vn-qb", 52],
    ["vn-723", 53],
    ["vn-nt", 54],
    ["vn-6365", 55],
    ["vn-299", 56],
    ["vn-300", 57],
    ["vn-qt", 58],
    ["vn-tt", 59],
    ["vn-da", 60],
    ["vn-ag", 61],
    ["vn-cm", 62],
    ["vn-tv", 63],
    ["vn-cb", 64],
    ["vn-kg", 65],
    ["vn-lo", 66],
    ["vn-db", 67],
    ["vn-ls", 68],
    ["vn-th", 69],
    ["vn-307", 70],
    ["vn-tq", 71],
    ["vn-bi", 72],
    ["vn-333", 73],
  ];

  async function fetchData() {
    const data = await fetch(
      "https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json"
    ).then((response) => response.json());
    if (data) {
      setTopology(data);
    }
    console.log(data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    chart: {
      map: topology,
    },

    title: {
      text: "Highcharts Maps basic demo",
    },

    subtitle: {
      text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json">Vietnam</a>',
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },

    colorAxis: {
      min: 0,
    },
    width: "80vw",
    series: [
      {
        // Specify the series data
        data: data,
        // mapData: topology,
        // joinBy: "hc-key", // Join by key to map data
        name: "Random data",
        states: {
          hover: {
            color: "#a4edba",
          },
        },
        // type: "area",
        ataLabels: {
            enabled: true,
            format: '{point.name}'
        }
      },
      // }]
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"mapChart"}
      options={options}
    />
  );
}