"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type PropsType = {
  className?: string;
  splitResult: Array<{ name: string, idx: number }>;
}

export function SplitResultTable({ className, splitResult }: PropsType) {
  const placeHolder = "Loading split result data...";
  // 计算 sum(12-idx)
  const totalBlocks = splitResult && splitResult.length > 0
    ? splitResult.reduce((sum, item) => sum + (12 - item.idx), 0)
    : 0;
  return (
    <div className={cn("rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <h2 className="text-body-2xlg text-base font-bold text-dark dark:text-white">
        Split Result
      </h2>
      {(!splitResult || splitResult.length === 0) ? (
        <div>{placeHolder}</div>
      ) : (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-center font-bold">Device Name</TableCell>
              {splitResult.map((item, idx) => (
                <TableCell key={"name-" + idx} className="text-center font-bold text-lg">{item.name}</TableCell>
              ))}
            <TableCell className="text-center font-bold  text-lg">Total Blocks</TableCell>
            <TableCell className="text-center font-bold border-l border-gray-300 dark:border-dark-3  text-lg">Cloud-only Blocks</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center font-bold">Split Index</TableCell>
              {splitResult.map((item, idx) => (
                <TableCell key={"idx-" + idx} className="text-center  text-lg">{item.idx}</TableCell>
              ))}
            <TableCell className="text-center font-bold  text-lg">{totalBlocks} ({Math.round(((48 - totalBlocks) / 48) * 100)}%↓) </TableCell>
            <TableCell className="text-center font-bold border-l border-gray-300 dark:border-dark-3  text-lg">48 (12 blocks × 4 devs)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
} 


export function TableExample() {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Top Channels
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Source</TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead className="!text-right">Revenues</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Conversion</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={100}>
                <Skeleton className="h-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


