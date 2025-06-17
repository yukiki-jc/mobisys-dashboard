export type ChartData = {
  received: DataPoint[];
};
export type DataPoint = {
  x: string | number;
  y: number;
};
export type ShownChartData = {
  real: DataPoint[];
  baseline: DataPoint[] | null;
  realLatency: DataPoint[];
  baselineLatency: DataPoint[] | null;
}
export type ClientChartData = {
  e2eLatency: number;
  transmissionLatency: number;
  devLatency: number;
  sevLatency: number;
}