'use client';

import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { SettingsContainer } from "./settings-container";
import { useState } from "react";

type PropsType = {
  timeFrame?: string;
};

export function DashboardContent({ timeFrame }: PropsType) {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      <SettingsContainer 
        className="col-span-12 xl:col-span-5" 
        isRunning={isRunning} 
        setIsRunning={setIsRunning} 
      />
      <PaymentsOverview
        className="col-span-12 xl:col-span-7"
        isRunning={isRunning}
      />
    </div>
  );
} 