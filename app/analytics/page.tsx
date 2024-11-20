import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Garden Analytics</h1>
        <p className="text-muted-foreground">
          Track your gardening progress and insights
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}