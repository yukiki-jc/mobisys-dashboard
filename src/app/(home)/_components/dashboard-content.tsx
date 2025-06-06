'use client';

import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { SettingsContainer } from "./settings-container";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { fetchAvgThroughputAndLatency, getDynamicThroughputData } from "@/services/inference.services";
import type { ChartData } from "@/types/charts";
import { getDeafultDynamicThroughputData } from "@/services/charts.services";
import { SplitResultTable } from "./split-result-table";
import { exampleTraceRecord } from "./trace-reader";

// 用于每次 fetchData 时弹出 exampleTraceRecord 的下一个元素
let exampleTraceQueue = [...exampleTraceRecord];

type PropsType = {
  timeFrame?: string;
};
import { appendTraceRecord, downloadTraceRecord } from "./trace-recorder";

export function DashboardContent({ timeFrame }: PropsType) {
  const [isRunning, setIsRunning] = useState(false);
  
  const [history, setHistory] = useState<{throughput: number, latency: number}[]>([]);
  const [baseHistory, setBaseHistory] = useState<{throughput: number, latency: number}[]>([]);
  const [counter, setCounter] = useState(0);
  const [throughputData, setThroughputData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  const [baseThroughputData, setBaseThroughputData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  const [latencyData, setLatencyData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  const [baseLatencyData, setBaseLatencyData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  const [splitResult, setSplitResult] = useState<Array<{ name: string, idx: number }>>([]);
  
  const fetchData = async (isRunning: boolean, counter: number) => {
    if (!isRunning) return;
    const data = await fetchAvgThroughputAndLatency(counter);

    // 每次调用弹出 exampleTraceRecord 的下一个元素
    let baseData = exampleTraceQueue.length > 0 ? exampleTraceQueue.shift() : null;

    // appendTraceRecord(data);
    if (data.avg_throughput >= 10 && data.avg_throughput <= 500) {
      setHistory(prev => [...prev, {throughput: data.avg_throughput, latency: data.avg_latency}]);
    }
    
    if (baseData && baseData.avg_throughput >= 10 && baseData.avg_throughput <= 500) {
      setBaseHistory(prev => [...prev, {throughput: baseData.avg_throughput, latency: baseData.avg_latency}]);
    }
      
  };

    // 根据 history 更新 throughputData
  // 通用的移动平均和左移处理函数
  function updateChartDataFromHistory(historyArr: {throughput: number, latency: number}[],
    throughputData: ChartData,
    latencyData: ChartData,
    setThroughputData: (v: ChartData) => void,
    setLatencyData: (v: ChartData) => void,
    windowSize = 6
  ) {
    if (historyArr.length === 0) return;
    const cur_throughput = [...throughputData.received];
    const cur_latency = [...latencyData.received];
    const chart_len = cur_throughput.length;
    // 左移所有元素
    for (let i = 1; i < chart_len; i++) {
      cur_throughput[i - 1].y = cur_throughput[i].y;
      cur_latency[i - 1].y = cur_latency[i].y;
    }
    // 计算新元素的移动平均
    const last_eles = historyArr.slice(-windowSize);
    let sum_throughput = 0;
    let sum_latency = 0;
    let count = last_eles.length;
    for (let i = 0; i < count; i++) {
      sum_throughput += last_eles[i].throughput;
      sum_latency += last_eles[i].latency;
    }
    const avg_throughput = count > 0 ? sum_throughput / count : 0;
    const avg_latency = count > 0 ? (sum_latency / count) * 1000 : 0; // 转换为毫秒
    // 填充最后一个元素
    cur_throughput[chart_len - 1].y = avg_throughput;
    cur_latency[chart_len - 1].y = avg_latency;
    setThroughputData({ ...throughputData, received: cur_throughput });
    setLatencyData({ ...latencyData, received: cur_latency });
  }

  useEffect(() => {
    updateChartDataFromHistory(
      history,
      throughputData,
      latencyData,
      setThroughputData,
      setLatencyData,
      6
    );
  }, [history]);

  useEffect(() => {
    updateChartDataFromHistory(
      baseHistory,
      baseThroughputData,
      baseLatencyData,
      setBaseThroughputData,
      setBaseLatencyData,
      6
    );
  }, [baseHistory]);

  const fetchFakeData = async (k: number, isRunning: boolean) => {
    if (isRunning) {
      const newData = await getDynamicThroughputData(k);
      setThroughputData(newData);
      setLatencyData(newData);
      setBaseThroughputData(newData);
      setBaseLatencyData(newData);
    }
    else {
      const newData = getDeafultDynamicThroughputData(k);
      setThroughputData(newData);
      setLatencyData(newData);
      setBaseThroughputData(newData);
      setBaseLatencyData(newData);
      setHistory([])
      setBaseHistory([])
    }
  };

  useEffect(() => {
    // 初始加载数据
    // fetchData(counter, isRunning ?? false);
    if (!isRunning) {
      setCounter(0);
      fetchFakeData(0, false);
      setHistory([])
      setBaseHistory([])
      return;
    }

    // 设置每秒更新一次，最多持续60秒
    const interval = setInterval(() => {
      setCounter(prev => {
        if (!isRunning) {
          fetchFakeData(prev, false);
          setHistory([])
          setBaseHistory([])
          return 0;
        }
        if (prev >= 29) {
          // downloadTraceRecord('trace-record.json');
          setIsRunning(false);
          fetchFakeData(0, false);
          setBaseHistory([])
          setHistory([])
          clearInterval(interval);
          
          return 0;
        }
        fetchData(isRunning, prev);
        return prev + 1;
      });
    }, 2000);

    // 清理定时器
    return () => clearInterval(interval);
  }, [isRunning]);
  
  return (
    <div className="mt-0 grid grid-cols-12 gap-4 md:mt-0 md:gap-4 2xl:mt-0 2xl:gap-4">
      <Toaster position="bottom-right" />
      <SettingsContainer 
        className="col-span-12 xl:col-span-12" 
        isRunning={isRunning} 
        setIsRunning={setIsRunning} 
        setSplitResult={setSplitResult}
      />
      {/* 独占一行 */}
      <div className="col-span-12">
        <SplitResultTable splitResult={splitResult} />
      </div>
      <PaymentsOverview
        className="col-span-12 xl:col-span-6"
        data={{ ...throughputData, baseline: baseThroughputData.received }}
        counter={counter}
        dataName="Average Throughput"
      />
      <PaymentsOverview
        className="col-span-12 xl:col-span-6"
        data={{ ...latencyData, baseline: baseLatencyData.received }}
        counter={counter}
        dataName="Average Latency"
      />
    </div>
  );
} 