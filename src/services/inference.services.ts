// 获取推理服务的吞吐量和延迟
export async function fetchAvgThroughputAndLatency(counter?: number) {
  const response = await fetch('http://127.0.0.1:8080/metrics', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`Network response status: ${response.status} ${response.statusText}`);
  }
  // 提取 JSON 结果
  const data = await response.json();
  // data 应该包含 avg_throughput 和 avg_latency
  const now = new Date();
  const timestamp = now.toISOString();
  console.log(`[${timestamp}] Fetched data (counter=${counter}):`, data);
  return {
    avg_throughput: data.avg_throughput,
    avg_latency: data.avg_latency,
  };
}
export async function getDynamicThroughputData(
  testData: number,
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    received: [
      // { x: -9, y: 20 + testData },
      // { x: -8, y: 35 + testData },
      // { x: -7, y: 45 + testData },
      // { x: -6, y: 35 + testData },
      { x: "-5", y: 55 + testData },
      { x: "-4", y: 65 + testData },
      { x: "-3", y: 50 + testData },
      { x: "-2", y: 65 + testData },
      { x: "-1", y: 75 + testData },
      { x: "0", y: 85 + testData },
    ]
  };
}

export async function getDynamicLatencyData(
  testData: number,
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    received: [
      // { x: -9, y: 20 + testData },
      // { x: -8, y: 35 + testData },
      // { x: -7, y: 45 + testData },
      // { x: -6, y: 35 + testData },
      { x: "-5", y: 15 + testData },
      { x: "-4", y: 25 + testData },
      { x: "-3", y: 30 + testData },
      { x: "-2", y: 45 + testData },
      { x: "-1", y: 55 + testData },
      { x: "0", y: 65 + testData },
    ]
  };
}

export async function getDynamicCombinedData(
  testData: number,
) {
  // Fake delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const newData = await getDynamicThroughputData(testData);
  const newLatencyData = await getDynamicLatencyData(testData); 
  const baseData = await getDynamicThroughputData(testData - 10);
  const baseLatencyData = await getDynamicLatencyData(testData - 10);
  return {
    throughput: newData,
    latency: newLatencyData,
    baseThroughput: baseData,
    baseLatency: baseLatencyData
  };
}