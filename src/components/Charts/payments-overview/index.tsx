'use client';

import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData, getDynamicThroughputData, getDeafultDynamicThroughputData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";
import { useEffect, useState } from "react";
import type { ChartData, DataPoint } from "@/types/charts";
type PropsType = {
  className?: string;
  dataName: string;
  data: ChartData;
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
    "Average Latency": "ms"
  }
  var ylimit = 0;
  if ("Average Throughput" === dataName) {
    ylimit = 300;
  }
  else {
    ylimit = 400;
  }
   // counter 不需要添加到依赖数组中，因为我们在 setCounter 的回调中使用了最新值

  if (!data) return <div>Loading...</div>;
  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {dataName}: Current Time = {counter * 2}s (0 at the x-axis)
        </h2>

        {/* <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" /> */}
      </div>

      <PaymentsOverviewChart data={data} ylimit={ylimit} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-1 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3 flex justify-center items-center">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(data.received.length > 0 ? data.received[data.received.length - 1].y : 0)} {unitDict[dataName as keyof typeof unitDict]}
          </dt>
          <dd className="font-medium dark:text-dark-6">{dataName}</dd>
        </div>

        {/* <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            ${standardFormat(data.due.reduce((acc: number, { y }: DataPoint) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Due Amount</dd>
        </div> */}
      </dl>
    </div>
  );
}
