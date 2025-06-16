'use client';

import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData, getDynamicThroughputData, getDeafultDynamicThroughputData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";
import { useEffect, useState } from "react";
import type { ChartData, DataPoint, ShownChartData } from "@/types/charts";



type PropsType = {
  className?: string;
  dataName: string;
  data: ShownChartData;
  counter: number;
};

export function PaymentsOverview({
  className,
  dataName,
  data,
  counter
}: PropsType) {
  
  const unitDict = {
    "Average Throughput": "Request/s",
    "Average Serving Latency": "ms"
  }
  var ylimit = 0;
  var realData = data.real.length > 0 ? data.real[data.real.length - 1].y : 0
  var baseData = data.baseline ? (data.baseline.length > 0 ? data.baseline[data.baseline.length - 1].y : 0) : 0;
  // 用 realData 和 baseData 中大的除以小的得到 speed up 
  const maxData = Math.max(realData, baseData);
  const minData = Math.min(realData, baseData);
  var better = 0;
  var betterStr = "";
  if ("Average Throughput" === dataName) {
    ylimit = 300;
    better = minData ? maxData / (minData) - 1 : 0; 
    betterStr = "↑";
  }
  else {
    ylimit = 400;
    better = minData ? (maxData - minData) / (maxData) : 0;
    betterStr = "↓";
  }
  
  if (!data) return <div>Loading...</div>;
  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="w-full text-body-2xlg font-bold text-dark dark:text-white">
          Time {counter * 2}s
        </h2>
        <h2 className="w-full text-body-2xlg font-bold text-dark dark:text-white">
          {dataName}: {standardFormat(data.real.length > 0 ? data.real[data.real.length - 1].y : 0)} {unitDict[dataName as keyof typeof unitDict]}, {standardFormat(better * 100)}% {betterStr} 
        </h2>

        {/* <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" /> */}
      </div>

      <PaymentsOverviewChart data={data} ylimit={ylimit} />

      {/* <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-1 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3 flex justify-center items-center">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(data.real.length > 0 ? data.real[data.real.length - 1].y : 0)} {unitDict[dataName as keyof typeof unitDict]}, {standardFormat(better * 100)}% {betterStr} 
          </dt>
          <dd className="font-medium dark:text-dark-6">{dataName}</dd>
        </div>
      </dl> */}
    </div>
  );
}
