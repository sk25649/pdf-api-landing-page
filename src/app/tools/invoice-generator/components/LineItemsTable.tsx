"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  InvoiceFormData,
  calculateLineItemAmount,
  formatCurrency,
} from "../types";

interface LineItemsTableProps {
  form: UseFormReturn<InvoiceFormData>;
}

export function LineItemsTable({ form }: LineItemsTableProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchLineItems = form.watch("lineItems");

  return (
    <div className="space-y-3">
      <div className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_100px_40px] gap-2 text-sm font-medium text-muted-foreground">
        <div>Description</div>
        <div>Qty</div>
        <div>Unit Price</div>
        <div>Amount</div>
        <div></div>
      </div>

      {fields.map((field, index) => {
        const item = watchLineItems?.[index];
        const amount = item ? calculateLineItemAmount(item) : 0;

        return (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_100px_40px] gap-2 items-start p-3 sm:p-0 bg-muted/30 sm:bg-transparent rounded-lg"
          >
            <div>
              <label className="text-xs text-muted-foreground sm:hidden mb-1 block">
                Description
              </label>
              <Input
                placeholder="Item description"
                {...form.register(`lineItems.${index}.description`)}
              />
              {form.formState.errors.lineItems?.[index]?.description && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.lineItems[index]?.description?.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground sm:hidden mb-1 block">
                Quantity
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="1"
                {...form.register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground sm:hidden mb-1 block">
                Unit Price
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center h-9 px-3 text-sm bg-muted/50 rounded-md">
              <span className="text-xs text-muted-foreground sm:hidden mr-2">
                Amount:
              </span>
              {formatCurrency(amount)}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({ description: "", quantity: 1, unitPrice: 0 })
        }
        className="w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Line Item
      </Button>

      {form.formState.errors.lineItems?.root && (
        <p className="text-sm text-destructive">
          {form.formState.errors.lineItems.root.message}
        </p>
      )}
    </div>
  );
}
