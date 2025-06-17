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
import { FormEvent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const SCENARIOS = [
  {
    key: "A",
    label: "A",
    bandwidth: 3,
    accuracy: 0.1,
    latency: 0.81,
    bandwidthDesc: "High",
    accuracyDesc: "High",
    deadlineDesc: "Loose",
  },
  {
    key: "B",
    label: "B",
    bandwidth: 3,
    accuracy: 0.04,
    latency: 0.81,
    bandwidthDesc: "High",
    accuracyDesc: "Low",
    deadlineDesc: "Loose",
  },
  {
    key: "C",
    label: "C",
    bandwidth: 1,
    accuracy: 0.1,
    latency: 0.81,
    bandwidthDesc: "Low",
    accuracyDesc: "High",
    deadlineDesc: "Loose",
  },
  {
    key: "D",
    label: "D",
    bandwidth: 3,
    accuracy: 0.1,
    latency: 0.63,
    bandwidthDesc: "High",
    accuracyDesc: "High",
    deadlineDesc: "Tight",
  },
];



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
  onSettingsChange: (settings: {
    bandwidth: number;
    accuracy: number;
    latency: number;
  }) => void;
  isRunning: boolean;
  isStartEnabled: boolean;
  setIsStartEnabled: (v: boolean) => void;
  onStart: () => void;
  onStop: () => void; // 添加可选的停止处理函数
};

export function SplitSettingForm({ className, onSettingsChange, isRunning, isStartEnabled, setIsStartEnabled, onStart, onStop }: PropsType) {
  // const [isStartEnabled, setIsStartEnabled] = useState(false);

  // 只要有输入变动就禁用 start
  const handleAnyInputChange = () => {
    setIsStartEnabled(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const settings = {
      bandwidth: Number(formData.get("bandwidth")),
      accuracy: Number(formData.get("accuracy")),
      latency: Number(formData.get("latency")),
    };

    onSettingsChange?.(settings);
    
  };

  const handleStart = () => {
    if (isStartEnabled && !isRunning) {
      console.log('Starting...');
      onStart();
    }
  };

  const handleStop = () => {
    if (isRunning) {
      console.log('Stopping...');
      onStop();// 停止后禁用两个按钮
      // TODO: 添加停止处理逻辑
    }
  };

  const [selected, setSelected] = useState("A");

  const handleApply = () => {
    const scenario = SCENARIOS.find(s => s.key === selected);
    if (scenario) {
      onSettingsChange({
        bandwidth: scenario.bandwidth,
        accuracy: scenario.accuracy,
        latency: scenario.latency,
      });
      setIsStartEnabled(true);
    }
  };
  const scenario = SCENARIOS.find(s => s.key === selected);
  const handleScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
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
      <form>
        <div className="mb-5.5 overflow-x-auto">
  <Table>
    <TableBody>
      <TableRow className="bg-gray-100">
        <TableCell className="text-center font-bold text-lg">Select</TableCell>
        <TableCell className="text-center font-bold text-lg">Scenario</TableCell>
        <TableCell className="text-center font-bold text-lg">Bandwidth</TableCell>
        <TableCell className="text-center font-bold text-lg">Accuracy Loss</TableCell>
        <TableCell className="text-center font-bold text-lg">Deadline</TableCell>
      </TableRow>
      {SCENARIOS.map(s => (
        <TableRow key={s.key}>
          <TableCell className="text-center">
            <input
              type="radio"
              name="scenario"
              value={s.key}
              checked={selected === s.key}
              onChange={handleScenarioChange}
              disabled={isRunning}
            />
          </TableCell>
          <TableCell className="text-center font-bold text-lg">{s.label}</TableCell>
          <TableCell className="text-center font-bold text-base">{s.bandwidthDesc}</TableCell>
          <TableCell className="text-center font-bold text-base">{s.accuracyDesc}</TableCell>
          <TableCell className="text-center font-bold text-base">{s.deadlineDesc}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
        <div className="mb-5.5">
          <div className="mb-5.5 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1 flex items-center gap-1" htmlFor="bandwidth">
      <BandwidthIcon />
      Bandwidth (MB/s)
    </label>
    <input
      id="bandwidth"
      type="number"
      className="w-full rounded border px-3 py-2 bg-gray-100 text-gray-700"
      value={scenario?.bandwidth ?? ""}
      disabled
      readOnly
    />
  </div>
  <div>
    <label className="block text-sm font-medium mb-1 flex items-center gap-1" htmlFor="accuracy">
      <AccuracyIcon />
      Accuracy Loss Limit
    </label>
    <input
      id="accuracy"
      type="number"
      className="w-full rounded border px-3 py-2 bg-gray-100 text-gray-700"
      value={scenario?.accuracy ?? ""}
      disabled
      readOnly
    />
  </div>
  <div>
    <label className="block text-sm font-medium mb-1 flex items-center gap-1" htmlFor="latency">
      <LatencyIcon />
      Latency Deadline (s)
    </label>
    <input
        id="latency"
        type="number"
        className="w-full rounded border px-3 py-2 bg-gray-100 text-gray-700"
        value={scenario?.latency ?? ""}
        disabled
        readOnly
    />
    </div>
  </div>
        </div>
        <div className="flex justify-center gap-3 mb-7.5">
          <button
            className={cn(
              "rounded-lg px-6 py-[7px] font-medium text-gray-2",
              !isRunning
                ? "bg-blue-500 hover:bg-opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            )}
            type="button"
            onClick={handleApply}
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
