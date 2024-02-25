import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Chart from "react-apexcharts";
import { ITithe } from "../Dizimistas/interfaces";
import moment from "moment-timezone";
import 'moment/locale/pt-br';

const Dashboards: React.FC = () => {
  const InitialData: ITithe[] = [];
  const [months, setMonths] = useState(['']);
  const [sumMonths, setSumMonths] = useState([0])

  const getData = () => {
    api.get("/tithe", {}).then((result) => {
      InitialData.push(result.data);

      const groupedByMonth = result.data.reduce((acc, e) => {
        const month = moment(e.date).locale('pt-br').format("MM/YYYY");
        acc[month] = (acc[month] || 0) + e.value;
        return acc;
      }, {});

      const monthlySummaries = Object.keys(groupedByMonth).map(month => ({
        month,
        sum: parseFloat(groupedByMonth[month].toFixed(2))
      }));
      setMonths(monthlySummaries.map((e) => {return e.month}))
      setSumMonths(monthlySummaries.map((e) => {return e.sum}))
    });
  };

  const options = {
    xaxis: {
      categories: months,
      position: 'top',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
          }
    },
    colors: ['#B47D75'],
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return "R$ " + val ;
      },
      offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return "R$ " + val;
        }
      },
    },
  };

  
  const series = [
    {
      name: "Total do mês",
      data: sumMonths,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h2>Dashboards</h2>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={320}
      />
    </>
  );
};

export default Dashboards;
