import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { DashboardContent } from "./_components/dashboard-content";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      {/* <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense> */}

      <DashboardContent timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]} />
    </>
  );
}
