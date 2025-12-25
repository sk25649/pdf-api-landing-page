"use client";

import { UseFormReturn } from "react-hook-form";
import {
  InvoiceFormData,
  calculateLineItemAmount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
} from "../types";

interface InvoicePreviewProps {
  form: UseFormReturn<InvoiceFormData>;
}

export function InvoicePreview({ form }: InvoicePreviewProps) {
  const data = form.watch();
  const lineItems = data.lineItems || [];
  const subtotal = calculateSubtotal(lineItems);
  const taxAmount = calculateTax(subtotal, data.taxRate || 0);
  const total = calculateTotal(subtotal, taxAmount);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            {data.companyLogo && (
              <img
                src={data.companyLogo}
                alt="Company logo"
                className="h-12 w-auto object-contain"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {data.companyName || "Your Company"}
              </h2>
              {data.companyEmail && (
                <p className="text-sm text-gray-600">{data.companyEmail}</p>
              )}
              {data.companyAddress && (
                <p className="text-sm text-gray-600 whitespace-pre-line mt-1">
                  {data.companyAddress}
                </p>
              )}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-1">
              #{data.invoiceNumber || "INV-001"}
            </p>
          </div>
        </div>

        {/* Bill To & Invoice Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Bill To
            </h3>
            <p className="font-medium text-gray-900">
              {data.clientName || "Client Name"}
            </p>
            {data.clientEmail && (
              <p className="text-sm text-gray-600">{data.clientEmail}</p>
            )}
            {data.clientAddress && (
              <p className="text-sm text-gray-600 whitespace-pre-line mt-1">
                {data.clientAddress}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <div className="space-y-1">
              <div className="flex justify-between sm:justify-end gap-4">
                <span className="text-sm text-gray-500">Invoice Date:</span>
                <span className="text-sm font-medium">
                  {formatDate(data.invoiceDate)}
                </span>
              </div>
              <div className="flex justify-between sm:justify-end gap-4">
                <span className="text-sm text-gray-500">Due Date:</span>
                <span className="text-sm font-medium">
                  {formatDate(data.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  Description
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 w-20">
                  Qty
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 w-24">
                  Price
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 w-28">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No items added
                  </td>
                </tr>
              ) : (
                lineItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">
                      {item.description || "—"}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right">
                      {item.quantity || 0}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(calculateLineItemAmount(item))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {(data.taxRate || 0) > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax ({data.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-gray-900 mt-2">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes & Payment Instructions */}
        {(data.notes || data.paymentInstructions) && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            {data.notes && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {data.notes}
                </p>
              </div>
            )}
            {data.paymentInstructions && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Payment Instructions
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {data.paymentInstructions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
