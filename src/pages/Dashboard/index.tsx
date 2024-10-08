import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Chart from "react-apexcharts";
import { ITithe } from "../Dizimistas/interfaces";
import moment from "moment-timezone";
import "moment/locale/pt-br";
import { Radio } from "antd";
import chroma from "chroma-js";

const Dashboards: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [typeDash, setTypeDash] = useState<"month" | "community">("month");
  const [colorArray, setColorArray] = useState<string[]>([]); // Estado para armazenar as cores

  useEffect(() => {
    api.get<ITithe[]>("/tithe").then((result) => {
      const data = result.data;

      if (typeDash === "month") {
        const groupedData = data.reduce((acc, e) => {
          const month = moment(e.date).locale("pt-br").format("MM/YYYY");
          acc[month] = (acc[month] || 0) + e.value;
          return acc;
        }, {} as Record<string, number>);

        const newCategories = Object.keys(groupedData);
        const newData = Object.values(groupedData).map((v) =>
          parseFloat(v.toFixed(2))
        );

        setCategories(newCategories);
        setSeriesData([
          {
            name: "Total do Mês",
            data: newData,
          },
        ]);
      } else {
        const groupedData = data.reduce((acc, e) => {
          const month = moment(e.date).locale("pt-br").format("MM/YYYY");
          if (!acc[e.community]) {
            acc[e.community] = {};
          }
          acc[e.community][month] = (acc[e.community][month] || 0) + e.value;
          return acc;
        }, {} as Record<string, Record<string, number>>);

        const allMonths = [
          ...new Set(data.map((e) => moment(e.date).locale("pt-br").format("MM/YYYY"))),
        ];
        setCategories(allMonths);

        const newSeries = Object.keys(groupedData).map((community) => ({
          name: community,
          data: allMonths.map((month) => groupedData[community][month] || 0),
        }));

        setSeriesData(newSeries);
      }
    });
  }, [typeDash]);

  useEffect(() => {
    // Função para gerar o array de cores
    function generateColorArray(inputColor: string) {
      const colorScale = chroma.scale([inputColor, chroma.random()]).mode("lab").colors(5);
      return colorScale;
    }

    // Obtém a cor do tema da API
    api.get("/theme").then((response) => {
      const inputColor = response.data[0].secundary; // Obtemos a cor secundária da API
      const generatedColors = generateColorArray(inputColor); // Geramos as cores com base na cor secundária
      setColorArray(generatedColors); // Atualizamos o estado com o array de cores
    });
  }, []); // O array vazio garante que esse useEffect rode apenas uma vez

  const options = {
    xaxis: {
      categories: categories,
      position: "top",
      axisBorder: { show: false },
      axisTicks: { show: false },
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
      tooltip: { enabled: true },
    },
    colors: colorArray, // Usamos o array de cores gerado
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => "R$ " + val,
      offsetY: -20,
      style: { fontSize: "12px", colors: ["#304758"] },
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
    },
  };

  return (
    <>
      <h2>DASHBOARDS</h2>
      <div style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}>
        <Radio.Group defaultValue={typeDash} onChange={(e) => setTypeDash(e.target.value)}>
          <Radio value="month">Mês</Radio>
          <Radio value="community">Comunidade</Radio>
        </Radio.Group>
      </div>
      <Chart options={options} series={seriesData} type="bar" height={320} />
    </>
  );
};

export default Dashboards;
