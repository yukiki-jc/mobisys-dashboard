"use client";

import { SplitSettingForm } from "./split-setting-form";
import { useState } from "react";
import { sendNewSetting, startInference } from "@/services/setting.services";

import { toast } from 'react-hot-toast';

type PropsType = {
  className: string;
  setIsRunning: (isRunning: boolean) => void;
  isRunning: boolean;
  setSplitResult: (result: Array<{ name: string, idx: number }>) => void; // 可选的分割结果设置函数
}

export function SettingsContainer({ className, setIsRunning, isRunning, setSplitResult }: PropsType) {
  const [isStartEnabled, setIsStartEnabled] = useState(false);

  const handleSettingsChange = async (settings: {
    bandwidth: number;
    accuracy: number;
    latency: number;
  }) => {
    try {
      const deviceDict = await sendNewSetting(settings);
      // 将 deviceDict 转换为数组 [{ name, idx }]
      const deviceArr = Object.entries(deviceDict).map(([name, idx]) => {
        let numIdx = Number(idx);
        if (numIdx < 0) numIdx = 0;
        return { name, idx: numIdx };
      });
      setSplitResult(deviceArr);
      toast.success("Settings updated successfully!");
      setIsStartEnabled(true);
      setIsRunning?.(false); // 重置运行状态
    } catch (err: any) {
      toast.error("Failed to update settings: " + (err.message || "Unknown error"));
    }
  };

  const onStart = async () => {
    if (isStartEnabled && !isRunning) {
      try {
        await startInference();
        setIsRunning(true);
        toast.success("Inference started successfully!");
      } catch (err: any) {
        toast.error("Failed to start inference: " + (err.message || "Unknown error"));
        setIsRunning(false); // 启动失败时重置运行状态
      }
    }
  }

  const onStop = () => {
    if (isRunning) {
      setIsRunning(false);
      // setIsStartEnabled(false); 
    }
  }
  
  return (
    
      <SplitSettingForm 
        className={className}
        onSettingsChange={handleSettingsChange}
        isRunning={isRunning}
        isStartEnabled={isStartEnabled}
        onStart={onStart}
        onStop={onStop}
        setIsStartEnabled={setIsStartEnabled}
      />
  );
} 