'use client';

import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData, getDynamicThroughputData, getDeafultDynamicThroughputData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";
import { useEffect, useState } from "react";

type DataPoint = {
  x: string | number;
  y: number;
};

type ChartData = {
  received: DataPoint[];
};

type PropsType = {
  isRunning?: boolean;
  className?: string;
};

export function PaymentsOverview({
  isRunning,
  className,
}: PropsType) {
  const [data, setData] = useState<ChartData | null>(null);
  const [counter, setCounter] = useState(0);

  const fetchData = async (k: number, isRunning: boolean) => {
    if (isRunning) {
      const newData = await getDynamicThroughputData(k);
      setData(newData);
    }
    else {
      setData(getDeafultDynamicThroughputData(k));
    }
  };

  useEffect(() => {
    // 初始加载数据
    fetchData(counter, isRunning ?? false);

    // 设置每秒更新一次
    const interval = setInterval(() => {
      setCounter(prev => {
        const newCounter = prev + 1;
        fetchData(newCounter, isRunning ?? false);
        return newCounter;
      });
    }, 1000);

    // 清理定时器
    return () => clearInterval(interval);
  }, [isRunning]); // counter 不需要添加到依赖数组中，因为我们在 setCounter 的回调中使用了最新值

  if (!data) return <div>Loading...</div>;
  console.log(data);
  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Real-time Throughput: Current Time = {counter}s (0 at the x-axis)
        </h2>

        {/* <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" /> */}
      </div>

      <PaymentsOverviewChart data={data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-1 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3 flex justify-center items-center">
          <dt className="text-xl font-bold text-dark dark:text-white">
            ${standardFormat(data.received.reduce((acc: number, { y }: DataPoint) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Received Amount</dd>
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
