export type ChartData = {
  received: DataPoint[];
  baseline?: DataPoint[];
};
export type DataPoint = {
  x: string | number;
  y: number;
};