import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  CUSTOMER_DATA,
  MERDED_DATA,
  PRODUCT_DATA,
  REVENUE_DATA,
} from "../../constant/dummy";
import { REPORTS_GRAPH_NAV } from "../../constant/admin/index";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ReportsGraph = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [navData, setNavData] = useState({});
  const [activeMetric, setActiveMetric] = useState("customers");

  useEffect(() => {
    const totalCustomers =
      CUSTOMER_DATA.reduce((acc, val) => acc + Number(val.count), 0) / 1000 +
      "k";
    const totalProducts =
      PRODUCT_DATA.reduce((acc, val) => acc + val.productAdded, 0) / 1000 + "k";
    const totalsoldProducts =
      PRODUCT_DATA.reduce((acc, val) => acc + val.soldProducts, 0) / 1000 + "k";
    const productsInStock =
      (PRODUCT_DATA.reduce((acc, val) => acc + val.productAdded, 0) -
        PRODUCT_DATA.reduce((acc, val) => acc + val.soldProducts, 0)) /
        1000 +
      "k";
    const totalRevenue =
      REVENUE_DATA.reduce((acc, val) => acc + val.revenue, 0) / 1000 + "k";

    setNavData({
      totalCustomers,
      totalProducts,
      totalsoldProducts,
      productsInStock,
      totalRevenue,
    });
  }, [CUSTOMER_DATA, PRODUCT_DATA, REVENUE_DATA]);

  const chartData = {
    labels: MERDED_DATA.map((d) => d.day),
    datasets: [
      {
        label: activeMetric,
        data: MERDED_DATA.map((d) => d[activeMetric]),
        borderColor: "#ffffff",
        backgroundColor: "rgba(0, 92, 83, 0.2)",
        tension: 0,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return (
              label.charAt(0).toUpperCase() + label.slice(1, 3).toLowerCase()
            );
          },
          color: "#4B465C",
          font: {
            family: "Public+Sans", // customize font
            size: 13,
            weight: "400",
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 50000,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return value >= 1000 ? `${value / 1000}k` : value;
          },
          stepSize: 10000, // optional: sets regular intervals like 0k, 10k, 20k
        },
      },
    },
  };
  const shadowPlugin = {
    id: "lineShadow",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const _stroke = ctx.stroke;
      ctx.stroke = function () {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        _stroke.apply(this, arguments);
        ctx.restore();
      };
    },
  };

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="w-full h-20  aspect-square px-3 grid grid-cols-5 gap-5 ">
        {REPORTS_GRAPH_NAV.map((items, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveTab(index), setActiveMetric(items.metric);
            }}
            className={`w-full h-full transition-all duration-150 p-2 flex flex-col ${
              activeTab === index
                ? "border-b-[3px] border-[#fffff] bg-gradient-to-t bg-[rgba(15,96,255,0.04)] from-5% to-0% "
                : ""
            } `}
          >
            <div className="header w-full h-full text-2xl font-bold font-public flex items-center ">
              {navData[items.option] ?? "_"}
            </div>
            <div className="w-full h-fit font-medium font-public capitalize text-[#8B909A] text-[13px] ">
              {items.title}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-[300px] px-3">
        <Line
          data={chartData}
          options={chartOptions}
          plugins={[shadowPlugin]}
        />
      </div>
    </div>
  );
};

export default ReportsGraph;
