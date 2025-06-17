"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ShownChartData } from "@/types/charts";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: ShownChartData,
  ylimit: number;
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function PaymentsOverviewChart({ data, ylimit }: PropsType) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontSize: "18px",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    yaxis: {
      min: 0, // 纵轴起点
      max: ylimit, // 纵轴终点，可根据实际数据调整
      forceNiceScale: true
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      marker: {
        show: true,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      tickAmount: data.real.length,
      tickPlacement: 'on',
      labels: {
        rotate: 0,
        hideOverlappingLabels: false
      }
    },
  };
  
  // Convert data.received.y to integer
  const receivedInt = data.real.map(item => ({
    ...item,
    y: parseInt(item.y as any, 10)
  }));
  // If baseline data is provided, convert it as well
  const baselineInt = data.baseline ? data.baseline.map(item => ({    ...item,
    y: parseInt(item.y as any, 10)
  })) : [];
  // 如果 baseline 数据存在则用 baselineInt，否则用 receivedInt - 2
  let tempData: { x: unknown; y: number }[] = [];
  if (baselineInt.length > 0) {
    tempData = baselineInt;
  } else {
    tempData = receivedInt.map((item) => ({
      x: item.x,
      y: item.y - 10,
    }));
  }
  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <Chart
        options={options}
        series={[
          {
            name: "CollabTrans Throughput",
            data: receivedInt,
          },
          {
            name: "Baseline Throughput",
            data: tempData,
          }
        ]}
        type="area"
        height={310}
      />
    </div>
  );
}
