"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCheckoutSuccess = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (isCheckoutSuccess) {
      toast.success("Payment successful! Your plan has been upgraded.");

      // Remove the query param and refresh to get updated data
      const timer = setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isCheckoutSuccess, router]);

  return null;
}
