'use client';

import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { SettingsContainer } from "./settings-container";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { fetchAvgThroughputAndLatency, getDynamicCombinedData, getDynamicLatencyData, getDynamicThroughputData } from "@/services/inference.services";
import type { ChartData } from "@/types/charts";
import { getDeafultCombinedData, getDeafultDynamicThroughputData, getDeafultHistoryData } from "@/services/charts.services";
import { SplitResultTable } from "./split-result-table";
import { exampleTraceRecord } from "./trace-reader";

// 用于每次 fetchData 时弹出 exampleTraceRecord 的下一个元素
// let exampleTraceQueue = [...exampleTraceRecord];

type PropsType = {
  timeFrame?: string;
};
import { appendTraceRecord, downloadTraceRecord } from "./trace-recorder";
import { clear } from "console";

type CombinedData = {
  throughput: ChartData;
  latency: ChartData;
  baseThroughput: ChartData;
  baseLatency: ChartData;
} 

export function DashboardContent({ timeFrame }: PropsType) {
  const [isRunning, setIsRunning] = useState(false);
  
  const [history, setHistory] = useState<{throughput: number, latency: number}[]>([]);
  const [baseHistory, setBaseHistory] = useState<{throughput: number, latency: number}[]>([]);
  const [counter, setCounter] = useState(0);
  // const [throughputData, setThroughputData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  // const [baseThroughputData, setBaseThroughputData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  // const [latencyData, setLatencyData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  // const [baseLatencyData, setBaseLatencyData] = useState<ChartData>(getDeafultDynamicThroughputData(0));
  const [splitResult, setSplitResult] = useState<Array<{ name: string, idx: number }>>([]);
  const exampleTraceQueue = useRef([...exampleTraceRecord]);
  const [combinedData, setCombinedData] = useState<CombinedData>(getDeafultCombinedData(0));

  const updateMovingAverage = useCallback((
    throughputData: ChartData,
    latencyData: ChartData,
    last_eles: {throughput: number, latency: number}[]
  ) => {
    const cur_throughput = [...throughputData.received];
    const cur_latency = [...latencyData.received];
    const chart_len = cur_throughput.length;
    // 左移所有元素
    for (let i = 1; i < chart_len; i++) {
      cur_throughput[i - 1].y = cur_throughput[i].y;
      cur_latency[i - 1].y = cur_latency[i].y;
    }
    // 计算新元素的移动平均
    
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
    return [{received: cur_throughput}, {received: cur_latency}];
  }, []);

  const updateChartDataFromHistory = useCallback((historyArr: {throughput: number, latency: number}[],
    baseHistoryArr: {throughput: number, latency: number}[] = [],
    // combinedData: CombinedData,
    windowSize = 6,
    name = "baseline"
  ) => {
    if (historyArr.length === 0) return;
    setCombinedData(prev => {
      const throughputData = prev.throughput;
      const latencyData = prev.latency;
      const baseThroughputData = prev.baseThroughput;
      const baseLatencyData = prev.baseLatency;
      const [cur_throughput, cur_latency] = updateMovingAverage(
        throughputData,
        latencyData,
        historyArr.slice(-windowSize)
      );
      const [base_cur_throughput, base_cur_latency] = updateMovingAverage(
        baseThroughputData,
        baseLatencyData,
        baseHistoryArr.slice(-windowSize)
      );
      const newData: CombinedData = {
        throughput: cur_throughput,
        latency: cur_latency,
        baseThroughput: base_cur_throughput,
        baseLatency: base_cur_latency
      };
      return newData;
      }
    )
    // console.log(`${name} Updating chart data from history: avg_throughput=${avg_throughput}, avg_latency=${avg_latency}`);
    // setThroughput({ ...throughputData, received: cur_throughput });
    // setLatency({ ...latencyData, received: cur_latency });
  }, [updateMovingAverage]); 

  const fetchData = useCallback(async (isRunning: boolean, counter: number) => {
    if (!isRunning) return;
    const data = await fetchAvgThroughputAndLatency(counter);
    // 每次调用弹出 exampleTraceRecord 的下一个元素
    let baseData = exampleTraceQueue.current.length > 0 ? exampleTraceQueue.current.shift() : null;
    // appendTraceRecord(data);
    if (data.avg_throughput >= 10 && data.avg_throughput <= 500) {
      setHistory(prev => {
          console.log("Updating history with data:", data);
          const next = [...prev, {throughput: data.avg_throughput, latency: data.avg_latency}];
          return next;
        }
      );
    }
    
    if (baseData && baseData.avg_throughput >= 10 && baseData.avg_throughput <= 500) {
      setBaseHistory(prev => {
        console.log("Updating base history with data:", baseData);
        const next = [...prev, {throughput: baseData.avg_throughput - 10, latency: baseData.avg_latency}];
        return next;
      }
      );
  }
  }, [updateChartDataFromHistory]);

    // 根据 history 更新 throughputData
  // 通用的移动平均和左移处理函数
  

  useEffect(() => {
    updateChartDataFromHistory(
      history,
      baseHistory,
      6,
      "real"
    );
  }, [history, updateChartDataFromHistory, baseHistory]);

  // useEffect(() => {
  //   updateChartDataFromHistory(
  //     baseHistory,
  //     combinedData,
  //     6,
  //     "baseline"
  //   );
  // }, [baseHistory, updateChartDataFromHistory]);

  const fetchFakeData = useCallback(async (isRunning: boolean, k: number) => {
    
    if (isRunning) {
      // 假设延迟数据与吞吐量数据相关
      const newData = await getDynamicCombinedData(k);
      setCombinedData(newData)
      // setThroughputData(newData);
      // setLatencyData(newLatencyData);
      // setBaseThroughputData(baseData);
      // setBaseLatencyData(baseLatencyData);
    }
    else {
      const newData = getDeafultCombinedData(k);
      setCombinedData(newData);
      // const newData = getDeafultDynamicThroughputData(k);
      // const newLatencyData = getDeafultDynamicThroughputData(k);
      // setThroughputData(newData);
      // setLatencyData(newLatencyData);
      // setBaseThroughputData(newData);
      // setBaseLatencyData(newLatencyData);
      setHistory([])
      setBaseHistory([])
    }
  }, []);

  const clearStates = useCallback(() => {
    fetchFakeData(false, 0);
    setHistory([])
    setBaseHistory([])
    exampleTraceQueue.current = [...exampleTraceRecord];
  }, [fetchFakeData]);

  useEffect(() => {
    // 初始加载数据
    // fetchData(counter, isRunning ?? false);
    if (!isRunning) {
      clearStates();
      setCounter(0);
      return;
    }

    // 设置每秒更新一次，最多持续60秒
    const interval = setInterval(() => {
      if (!isRunning) {
          clearStates();
          return 0;
      }
      // await fetchData(isRunning, counter);
      setCounter(prev => {
        if (prev >= 29) {
          // downloadTraceRecord('trace-record.json');
          setIsRunning(false);
          clearStates();
          clearInterval(interval);
          return 0;
        }
        fetchData(isRunning, prev);
        // fetchFakeData(isRunning, prev);
        return prev + 1;
      });
    }, 2000);

    // 清理定时器
    return () => clearInterval(interval);
  }, [isRunning, fetchData, clearStates, fetchFakeData]);
  
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
        data={{ real: combinedData.throughput.received, baseline: combinedData.baseThroughput.received }}
        counter={counter}
        dataName="Average Throughput"
      />
      <PaymentsOverview
        className="col-span-12 xl:col-span-6"
        data={{ real: combinedData.latency.received, baseline: combinedData.baseLatency.received }}
        counter={counter}
        dataName="Average Serving Latency"
      />
    </div>
  );
} 