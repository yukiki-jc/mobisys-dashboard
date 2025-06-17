"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ShownChartData } from "@/types/charts";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: ShownChartData,
  ylimit: number;
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// export function ClientChart({ data, ylimit }: PropsType) {
//   return (
    
//   );
// }
