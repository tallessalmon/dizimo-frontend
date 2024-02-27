import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Chart from "react-apexcharts";
import { ITithe } from "../Dizimistas/interfaces";
import moment from "moment-timezone";
import "moment/locale/pt-br";
import { Radio } from "antd";

const Dashboards: React.FC = () => {
  const InitialData: ITithe[] = [];
  const [categories, setCategories] = useState([""]);
  const [sumMonths, setSumMonths] = useState([0]);
  const [categoriesCommunity, setCategoriesCommunity] = useState([""]);
  const [sumCommunity, setSumCommunity] = useState([0]);
  const [typeDash, setTypeDash] = useState("month");

  const getData = () => {
    api.get("/tithe", {}).then((result) => {
      InitialData.push(result.data);

      const groupedByMonth = result.data.reduce((acc, e) => {
        const month = moment(e.date).locale("pt-br").format("MM/YYYY");
        acc[month] = (acc[month] || 0) + e.value;
        return acc;
      }, {});

      const groupedByCommunity = result.data.reduce((acc, e) => {
        const community = e.community;
        acc[community] = (acc[community] || 0) + e.value;
        return acc;
      }, {});

      const monthlySummaries = Object.keys(groupedByMonth).map(month => ({
        month,
        sum: parseFloat(groupedByMonth[month].toFixed(2))
      }));
      

      const summaries = Object.keys(groupedByCommunity).map((community) => ({
        community,
        sum: parseFloat(groupedByCommunity[community].toFixed(2)),
      }));

      setCategoriesCommunity(
        summaries.map((e) => {
          return e.community;
        })
      );
      setSumCommunity(
        summaries.map((e) => {
          return e.sum;
        })
      );

      setCategories(
        monthlySummaries.map((e) => {
          return e.month
        })
      );

      setSumMonths(
        monthlySummaries.map((e) => {
          return e.sum;
        })
      );
    });
  };

  const options = {
    xaxis: {
      categories: typeDash === "month" ? categories : categoriesCommunity,
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    colors: ["#B47D75"],
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return "R$ " + val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return "R$ " + val;
        },
      },
    },
  };

  const series = [
    {
      name: "Total do mês",
      data: typeDash === "month" ? sumMonths : sumCommunity,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h2>Dashboards</h2>
      <div
        style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}
      >
        <Radio.Group defaultValue={typeDash} onChange={(e) => setTypeDash(e.target.value)}> 
          <Radio value='month' children="Mês"/>   
          <Radio value='community' children="Comunidade"/>   
        </Radio.Group>
      </div>
      <Chart options={options} series={series} type="bar" height={320} />
    </>
  );
};

export default Dashboards;
