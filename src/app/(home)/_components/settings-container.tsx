"use client";

import { SplitSettingForm } from "./split-setting-form";

type PropsType = {
  className?: string;
  setIsRunning?: (isRunning: boolean) => void;
  isRunning?: boolean;
}
export function SettingsContainer({ className, setIsRunning, isRunning }: PropsType) {
  const handleSettingsChange = (settings: {
    bandwidth: number;
    accuracy: number;
    latency: number;
  }) => {
    console.log('Settings changed:', settings);
    // TODO: 处理设置更新，例如发送到后端 API
  };

  return (
    <SplitSettingForm 
      className={className}
      onSettingsChange={handleSettingsChange}
      isRunning={isRunning}
      setIsRunning={setIsRunning}
    />
  );
} 