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
import { LAST_WEEK_TOTAL, VISIT_CHART_DATA } from "../../constant/dummy";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const label = VISIT_CHART_DATA.map((data) => data.day);
const DataForChart = VISIT_CHART_DATA.map((data) => data.count);

const lastWeekCount = LAST_WEEK_TOTAL;

const thisWeekCount = DataForChart.reduce((acc, val) => acc + val, 0);

const displayCount = (thisWeekCount / 1000).toFixed(1) + "k";

const DiscountChart = () => {
  const canvasRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [isLower, setIsLower] = useState(false);
  const [percentageChange, setPercentageChange] = useState(0);
  const [lineColor, setLineColor] = useState("rgba(30, 181, 100, 1)");
  const [fillTopColor, setFillTopColor] = useState("rgba(30, 181, 100, 0.08)");
  const [fillBottomColor, setFillBottomColor] = useState(
    "rgba(30, 181, 100, 0)"
  );

  useEffect(() => {
    if (isLower) {
      setLineColor("rgba(208, 38, 38, 1)");
      setFillTopColor("rgba(208, 38, 38, 0.08)");
      setFillBottomColor("rgba(208, 38, 38, 0)");
    } else {
      setLineColor("rgba(30, 181, 100, 1)");
      setFillTopColor("rgba(30, 181, 100, 0.08)");
      setFillBottomColor("rgba(30, 181, 100, 0)");
    }
  }, [isLower]);

  useEffect(() => {
    if (lastWeekCount === 0) {
      setPercentageChange(0);
      setIsLower(false);
      return;
    }

    const difference = thisWeekCount - lastWeekCount;
    const percent = Math.abs((difference / lastWeekCount) * 100);

    const formattedPercentage = percent.toFixed(1);
    setPercentageChange(formattedPercentage);
    if (thisWeekCount < lastWeekCount) {
      setIsLower(true);
    } else {
      setIsLower(false);
    }
  }, [thisWeekCount, lastWeekCount]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Create vertical gradient from top to bottom
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, fillTopColor);
    gradient.addColorStop(1, fillBottomColor);
    setChartData({
      labels: label,
      datasets: [
        {
          data: DataForChart,
          fill: true,
          borderColor: lineColor,
          backgroundColor: gradient,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 0,
          borderCapStyle: "round",
        },
      ],
    });
  }, [lineColor, fillTopColor, fillBottomColor]);

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        display: false,
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
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-[200px] bg-white rounded-lg shadow-md p-5  flex flex-col ">
      <div className="w-full h-full flex flex-row gap-x-5">
        <div className="w-5/12 h-full justify-between flex flex-col ">
          <div className="flex flex-col  w-full h-fit">
            <h2 className="text-lg capitalize font-semibold whitespace-nowrap text-[#23272E] font-public">
              Discounted Amount
            </h2>
            <span className="text-[#8B909A] font-public text-sm font-medium">
              last 7 days
            </span>
          </div>
          <div className="w-full h-fit pb-6">
            <div className="w-full h-fit flex flex-row items-baseline gap-x-2">
              <h5 className="font-bold font-public text-3xl text-[#23272E] ">
                {displayCount}
              </h5>
            </div>
          </div>
        </div>

        <div className="w-7/12 h-full pt-10 flex flex-row justify-center items-center">
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width={221}
            height={75}
          />
          {chartData ? (
            <Line data={chartData} options={options} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
      <div className="w-full h-fit flex flex-row gap-x-4">
        <div className="w-fit h-fit flex flex-row gap-x-2 ">
          <span
            className={` text-sm font-public font-medium flex flex-row gap-x-1 ${
              isLower ? "text-[#D02626]" : "text-[#1EB564]"
            }`}
          >
            {isLower ? <FaArrowDown /> : <FaArrowUp />}
            {percentageChange}
          </span>
          <span className=" text-[#8B909A] font-medium text-sm font-public ">
            vs last 7 days
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscountChart;
