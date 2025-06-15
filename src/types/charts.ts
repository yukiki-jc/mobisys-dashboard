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
}