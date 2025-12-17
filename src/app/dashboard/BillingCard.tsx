"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { formatPlanName, getPlanPrice, getPlanFeatures } from "@/lib/plans";
import { createBillingPortalSession } from "./actions";

interface BillingCardProps {
  plan: string;
  stripeCustomerId: string | null;
}

export function BillingCard({ plan, stripeCustomerId }: BillingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isFree = plan.toLowerCase() === "free";
  const price = getPlanPrice(plan);
  const features = getPlanFeatures(plan);

  const handleManageSubscription = async () => {
    if (!stripeCustomerId) {
      toast.error("No billing account found");
      return;
    }

    setIsLoading(true);
    const result = await createBillingPortalSession();

    if ("error" in result) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    window.location.href = result.url;
  };

  return (
    <Card className="flex h-full w-full max-w-md flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Billing</CardTitle>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {formatPlanName(plan)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            ${price}
            <span className="text-base font-normal text-muted-foreground">
              /month
            </span>
          </div>
        </div>

        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        {isFree ? (
          <Button asChild className="w-full">
            <Link href="/pricing">Upgrade</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleManageSubscription}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Manage Subscription"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
