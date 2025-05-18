"use client";

import {
  CallIcon,
  EmailIcon,
  PencilSquareIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { cn } from "@/lib/utils";
import { FormEvent, useState } from "react";

function BandwidthIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  );
}

function AccuracyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
  );
}

function LatencyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  );
}

type PropsType = {
  className?: string;
  onSettingsChange?: (settings: {
    bandwidth: number;
    accuracy: number;
    latency: number;
  }) => void;
  isRunning?: boolean;
  setIsRunning?: (isRunning: boolean) => void;
};

export function SplitSettingForm({ className, onSettingsChange, isRunning, setIsRunning }: PropsType) {
  const [isStartEnabled, setIsStartEnabled] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const settings = {
      bandwidth: Number(formData.get("bandwidth")),
      accuracy: Number(formData.get("accuracy")),
      latency: Number(formData.get("latency")),
    };

    onSettingsChange?.(settings);
    setIsStartEnabled(true);
    setIsRunning?.(false); // 重置运行状态
  };

  const handleStart = () => {
    if (isStartEnabled && !isRunning) {
      console.log('Starting...');
      setIsRunning?.(true);
      // TODO: 添加开始处理逻辑
    }
  };

  const handleStop = () => {
    if (isRunning) {
      console.log('Stopping...');
      setIsRunning?.(false);
      setIsStartEnabled(false); // 停止后禁用两个按钮
      // TODO: 添加停止处理逻辑
    }
  };

  return (
      <div
        className={cn(
          "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Settings
          </h2>

        </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5">
          <InputGroup
            className="w-full"
            type="number"
            name="bandwidth"
            label="Bandwidth (MB/s)"
            placeholder="3"
            defaultValue="3"
            min="0"
            max="10"
            step="1"
            icon={<BandwidthIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full"
            type="number"
            name="accuracy"
            label="Accuracy Loss Limit"
            placeholder="0.04"
            defaultValue="0.04"
            min="0"
            max="0.1"
            step="0.02"
            icon={<AccuracyIcon />}
            iconPosition="left"
            height="sm"
          />
          
          <InputGroup
            className="w-full"
            type="number"
            name="latency"
            label="Latency Deadline (compared to dev-only)"
            placeholder="0.9"
            defaultValue="0.9"
            min="0"
            max="1"
            step="0.1"
            icon={<LatencyIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="flex justify-center gap-3">
          {/* <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
          >
            Cancel
          </button> */}

          <button
            className={cn(
              "rounded-lg px-6 py-[7px] font-medium text-gray-2",
              !isRunning
                ? "bg-primary hover:bg-opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            )}
            type="submit"
            disabled={isRunning}
          >
            Apply
          </button>
          <button
            className={cn(
              "rounded-lg px-6 py-[7px] font-medium text-gray-2",
              isStartEnabled && !isRunning
                ? "bg-green-500 hover:bg-opacity-90" 
                : "bg-gray-400 cursor-not-allowed"
            )}
            type="button"
            onClick={handleStart}
            disabled={!isStartEnabled || isRunning}
          >
            Start
          </button>
          <button
            className={cn(
              "rounded-lg px-6 py-[7px] font-medium text-gray-2",
              isRunning
                ? "bg-red-500 hover:bg-opacity-90" 
                : "bg-gray-400 cursor-not-allowed"
            )}
            type="button"
            onClick={handleStop}
            disabled={!isRunning}
          >
            Stop
          </button>
        </div>
      </form>
    </div>
  );
}
