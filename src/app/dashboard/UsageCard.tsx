"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPlanName } from "@/lib/plans";

interface UsageCardProps {
  current: number;
  limit: number;
  plan: string;
}

export function UsageCard({ current, limit, plan }: UsageCardProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isApproachingLimit = percentage > 80;
  const isNearLimit = percentage > 90;
  const isFree = plan.toLowerCase() === "free";

  const getProgressColor = () => {
    if (percentage > 80) return "bg-red-500";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usage</CardTitle>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {formatPlanName(plan)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            {current.toLocaleString()} / {limit.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">API calls this month</p>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {percentage.toFixed(0)}% used
          </p>
        </div>

        {isApproachingLimit && (
          <p className="text-sm font-medium text-amber-600 dark:text-amber-500">
            You&apos;re approaching your limit
          </p>
        )}
      </CardContent>

      {(isApproachingLimit || isFree) && (
        <CardFooter>
          {isFree ? (
            <Button asChild className="w-full">
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          ) : isNearLimit ? (
            <Button asChild variant="outline" className="w-full">
              <Link href="/pricing">Need more? Upgrade</Link>
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}
