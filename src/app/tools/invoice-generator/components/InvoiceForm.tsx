"use client";

import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { LineItemsTable } from "./LineItemsTable";
import {
  InvoiceFormData,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
} from "../types";
import { TAX_OPTIONS, getTaxRateByState } from "../tax-rates";

interface InvoiceFormProps {
  form: UseFormReturn<InvoiceFormData>;
}

export function InvoiceForm({ form }: InvoiceFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedTaxOption, setSelectedTaxOption] = useState<string>("none");

  const handleTaxOptionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedTaxOption(value);

      if (value !== "custom") {
        const rate = getTaxRateByState(value);
        form.setValue("taxRate", rate);
      }
    },
    [form]
  );

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 500000) {
        alert("Logo must be smaller than 500KB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        form.setValue("companyLogo", base64);
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const removeLogo = useCallback(() => {
    setLogoPreview(null);
    form.setValue("companyLogo", "");
  }, [form]);

  const watchLineItems = form.watch("lineItems");
  const watchTaxRate = form.watch("taxRate");
  const subtotal = calculateSubtotal(watchLineItems || []);
  const taxAmount = calculateTax(subtotal, watchTaxRate || 0);
  const total = calculateTotal(subtotal, taxAmount);

  return (
    <div className="space-y-6">
      {/* Company Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Your Company</CardTitle>
          <CardDescription>Your business details for the invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Acme Inc."
                {...form.register("companyName")}
              />
              {form.formState.errors.companyName && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.companyName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="billing@acme.com"
                {...form.register("companyEmail")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea
              id="companyAddress"
              placeholder="123 Main St&#10;City, State 12345"
              rows={2}
              {...form.register("companyAddress")}
            />
          </div>
          <div className="space-y-2">
            <Label>Logo (optional)</Label>
            {logoPreview ? (
              <div className="flex items-center gap-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-12 w-auto object-contain border rounded p-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeLogo}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                <span className="text-xs text-muted-foreground">Max 500KB</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Client</CardTitle>
          <CardDescription>Who you&apos;re billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="Client Company"
                {...form.register("clientName")}
              />
              {form.formState.errors.clientName && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.clientName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="contact@client.com"
                {...form.register("clientEmail")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Address</Label>
            <Textarea
              id="clientAddress"
              placeholder="456 Oak Ave&#10;City, State 67890"
              rows={2}
              {...form.register("clientAddress")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                placeholder="INV-001"
                {...form.register("invoiceNumber")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                {...form.register("invoiceDate")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input id="dueDate" type="date" {...form.register("dueDate")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Line Items</CardTitle>
          <CardDescription>Add your products or services</CardDescription>
        </CardHeader>
        <CardContent>
          <LineItemsTable form={form} />
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="taxOption">Tax Rate</Label>
              <Select
                id="taxOption"
                value={selectedTaxOption}
                onChange={handleTaxOptionChange}
              >
                <optgroup label="Options">
                  <option value="none">No Tax (0%)</option>
                  <option value="custom">Custom Rate</option>
                </optgroup>
                <optgroup label="US States">
                  {TAX_OPTIONS.filter(
                    (opt) => opt.value !== "none" && opt.value !== "custom"
                  ).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              </Select>
              <p className="text-xs text-muted-foreground">
                State tax rates shown are base rates. Local taxes may apply.
              </p>
            </div>

            {selectedTaxOption === "custom" && (
              <div className="flex items-center gap-3">
                <Label htmlFor="taxRate" className="whitespace-nowrap">
                  Custom Rate (%)
                </Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-24"
                  {...form.register("taxRate", { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {(watchTaxRate || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tax ({watchTaxRate}%)
                </span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Additional Information</CardTitle>
          <CardDescription>Optional notes and payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Payment terms: Net 30&#10;Thank you for your business!"
              rows={2}
              {...form.register("notes")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentInstructions">Payment Instructions</Label>
            <Textarea
              id="paymentInstructions"
              placeholder="Bank: Example Bank&#10;Account: 1234567890&#10;Routing: 987654321"
              rows={3}
              {...form.register("paymentInstructions")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
