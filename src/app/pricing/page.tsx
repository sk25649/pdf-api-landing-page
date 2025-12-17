import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckoutButton } from "./CheckoutButton";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "For trying out the API",
    features: ["100 calls/month", "Community support"],
    priceId: null,
  },
  {
    name: "Starter",
    price: 19,
    description: "For small projects",
    features: ["1,000 calls/month", "Email support"],
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    popular: false,
  },
  {
    name: "Pro",
    price: 49,
    description: "For growing businesses",
    features: ["5,000 calls/month", "Priority support"],
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    popular: true,
  },
  {
    name: "Business",
    price: 99,
    description: "For large scale operations",
    features: ["20,000 calls/month", "Dedicated support"],
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    popular: false,
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-lg">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.priceId ? (
                <CheckoutButton
                  priceId={plan.priceId}
                  planName={plan.name.toLowerCase()}
                  isLoggedIn={!!user}
                />
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
