import React, { useEffect, useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { SALES_AND_COST } from "../../constant/dummy";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
);
const SalesAndCostChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [isLower, setIsLower] = useState(false);

  const labels = SALES_AND_COST.map((data) => data.day);
  const sales = SALES_AND_COST.map((data) => data.sales);
  const cost = SALES_AND_COST.map((data) => data.cost);

  const totalSales = () => {
    const unformattedSales = sales.reduce((acc, val) => acc + val, 0);
    return (unformattedSales / 1000).toFixed(1) + "k";
  };
  const totalCost = () => {
    const unformattedCost = cost.reduce((acc, val) => acc + val, 0);
    return (unformattedCost / 1000).toFixed(1) + "k";
  };

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const height = ctx.canvas.clientHeight || 300;

    const salesGradient = ctx.createLinearGradient(0, 0, 0, height);
    salesGradient.addColorStop(0, "rgba(0,92,83,0.05)");
    salesGradient.addColorStop(1, "rgba(0,92,83,0)");

    const costGradient = ctx.createLinearGradient(0, 0, 0, height);
    costGradient.addColorStop(0, "rgba(15,183,255,0.05)");
    costGradient.addColorStop(1, "rgba(0,183,255,0)");

    const data = {
      labels,
      datasets: [
        {
          label: "Sales",
          data: sales,
          borderColor: "#005C53",
          backgroundColor: salesGradient,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          borderCapStyle: "round",
          tension: 0.3,
        },
        {
          label: "Cost",
          data: cost,
          borderColor: "#0FB7FF",
          backgroundColor: costGradient,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          borderCapStyle: "round",
          tension: 0.3,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            pointRadius: "50px",
            boxWidth: 10,
            fillStyle: "fill",
            padding: 4,

            color: "#23272E",
            font: {
              size: 10,
              weight: "bold",
              family: "sans-serif",
            },
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#8B909A",
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          border: {
            display: false,
          },
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "line",
      data,
      options,
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-full h-[200px] bg-white rounded-lg shadow-md p-5 flex flex-row gap-y-5">
      <div className="w-5/12 h-auto flex flex-col justify-between p-2 ">
        <div className="flex flex-col w-full h-fit">
          <h2 className="text-lg capitalize font-semibold text-[#23272E] font-public">
            Total Sales & Cost
          </h2>
          <span className="text-[#8B909A] font-public text-sm font-medium">
            last 7 days
          </span>
        </div>
        <div className="w-full h-fit">
          <div className="w-full h-fit flex flex-row items-baseline gap-x-2">
            <span className=" text-[#23272E]  ">AED</span>
            <h5 className="font-bold font-public text-3xl text-[#23272E] ">
              {totalSales()}
            </h5>
            <span className=" text-[#0FB7FF] text-base font-DM font-bold ">
              {" "}
              {totalCost()}{" "}
            </span>
          </div>
          <div className="w-full h-fit flex flex-row gap-x-2 mt-4">
            <span
              className={` text-sm font-public font-medium flex flex-row gap-x-1 ${
                isLower ? "text-[#D02626]" : "text-[#1EB564]"
              }`}
            >
              {isLower ? <FaArrowDown /> : <FaArrowUp />}
              {"8.6k"}
            </span>
            <span className=" text-[#8B909A] font-medium text-sm font-public ">
              vs last 7 days
            </span>
          </div>
        </div>
      </div>
      <div className="w-7/12 h-auto ">
        <canvas ref={chartRef} width="full" />
      </div>
    </div>
  );
};

export default SalesAndCostChart;
