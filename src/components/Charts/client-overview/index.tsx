'use client';

import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData, getDynamicThroughputData, getDeafultDynamicThroughputData } from "@/services/charts.services";
import { ClientChart } from "./chart";
import { useEffect, useRef, useState } from "react";
import type { ChartData, ClientChartData, DataPoint, ShownChartData } from "@/types/charts";



type PropsType = {
  className?: string;
  dataName: string;
  data: ClientChartData;
  counter: number;
};

function ClientMessageBox({ messages }: { messages: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-xl mx-auto my-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner p-4 h-48 overflow-y-auto border border-gray-200 dark:border-gray-700">
      {messages.length === 0 ? (
        <div className="text-gray-400 text-center">No messages yet.</div>
      ) : (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className="mb-2 px-3 py-2 rounded bg-white dark:bg-gray-700 shadow text-sm text-gray-800 dark:text-gray-100"
          >
            {msg}
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export function ClientOverview({
  className,
  dataName,
  data,
  counter
}: PropsType) {
  
  const unitDict = {
    "Average Throughput": "Request/s",
    "Average Serving Latency": "ms"
  }
  
  const [messages, setMessages] = useState<string[]>([]);

  // 假设每次 data.result 变化时推送新消息
  useEffect(() => {
    if (counter) {
      setMessages(prev =>
        prev.concat([`New result: ${counter}`])
      );
    }
  }, [counter]);

  if (!data) return <div>Loading...</div>;
  return (
    <div
          className={cn(
            "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
            className,
          )}
        >
          <h2 className="w-full text-body-2xlg font-bold text-dark dark:text-white">
              Mobile Phone Status
          </h2>
          <dl className="grid justify-center items-center divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
            <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3 flex flex-col justify-center items-center">
              <dt className="text-xl font-bold text-dark dark:text-white">
                123% ↓ than device!
              </dt>
              <dt className="text-xl font-bold text-dark dark:text-white">
                123
              </dt>
              
              <dd className="font-medium dark:text-dark-6">End-to-end Latency</dd>
            </div>
            <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3 flex flex-col justify-center items-center">
              <dt className="text-xl font-bold text-dark dark:text-white">
                123% ↓ than no compression!
              </dt>
              <dt className="text-xl font-bold text-dark dark:text-white">
                123 ms
              </dt>
              
              <dd className="font-medium dark:text-dark-6">Transmission Latency</dd>
            </div>
          </dl>
          <div className="flex justify-center items-center my-2">
            <dl className="grid justify-center items-center text-center">
              <div className="flex flex-col justify-center items-center">
                <dd className="font-medium dark:text-dark-6">Inference Latency</dd>
                <dt className="text-xl font-bold text-dark dark:text-white">
                  dev + server = 123 + 123 = 246 ms
                </dt>
              </div>
            </dl>
          </div>
          <ClientMessageBox messages={messages} />
        </div>
  );
}
