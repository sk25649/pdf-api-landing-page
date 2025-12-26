import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - DocAPI",
  description:
    "Terms of Service for DocAPI PDF generation API and free tools.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: December 25, 2024</p>
      </div>

      <div className="space-y-8">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using DocAPI&apos;s services, including our API and free
            tools (such as the Invoice Generator), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use our services.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">2. Description of Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">DocAPI provides:</p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">PDF Generation API:</strong> A paid service for generating PDF documents from HTML content programmatically.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Free Tools:</strong> Browser-based tools including our Invoice Generator that allow users to create documents without an account.</span>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">3. Free Tools (Invoice Generator)</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">3.1 No Data Storage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our free Invoice Generator tool does not store any data you enter. All
                information (company details, client information, line items, etc.) is
                processed in real-time to generate your PDF and is not saved on our
                servers. Once you close the browser tab, all entered data is lost.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">3.2 Intended Use</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The Invoice Generator is provided for legitimate business purposes
                only. You agree not to use this tool to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Create fraudulent or misleading invoices</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Impersonate other businesses or individuals</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Engage in any illegal activities</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Generate invoices for illegal goods or services</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">3.3 No Warranty</h3>
              <p className="text-muted-foreground leading-relaxed">
                The free Invoice Generator is provided &quot;as is&quot; without any warranty.
                We do not guarantee that the tool will be available at all times or
                that generated invoices will meet specific legal requirements in your
                jurisdiction. You are responsible for ensuring your invoices comply
                with applicable laws and regulations.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">3.4 Tax Calculations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Any tax calculations performed by our tools are for convenience only.
                You are solely responsible for determining the correct tax rates and
                ensuring compliance with tax laws in your jurisdiction.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">4. API Service</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">4.1 Account Registration</h3>
              <p className="text-muted-foreground leading-relaxed">
                To use our API service, you must create an account and obtain an API
                key. You are responsible for maintaining the confidentiality of your
                API key and for all activities that occur under your account.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">4.2 Usage Limits</h3>
              <p className="text-muted-foreground leading-relaxed">
                API usage is subject to the limits of your subscription plan. We
                reserve the right to throttle or suspend access if usage exceeds
                reasonable limits or violates these terms.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">4.3 Prohibited Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You may not use our API to generate PDFs containing:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Illegal content</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Malware or malicious code</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Content that infringes intellectual property rights</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Hate speech or content promoting violence</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>Spam or phishing content</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            You retain all rights to the content you create using our services.
            DocAPI retains all rights to its software, API, and services. You may
            not reverse engineer, decompile, or attempt to extract the source code
            of our services.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              To the maximum extent permitted by law, DocAPI shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages,
              including but not limited to loss of profits, data, or business
              opportunities, arising from your use of our services.
            </p>
            <p>
              Our total liability for any claims arising from these terms or your
              use of our services shall not exceed the amount you paid us in the
              twelve (12) months preceding the claim.
            </p>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">7. Indemnification</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to indemnify and hold harmless DocAPI and its officers,
            directors, employees, and agents from any claims, damages, losses, or
            expenses (including reasonable attorney fees) arising from your use of
            our services or violation of these terms.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">8. Modifications to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify
            users of material changes by posting the updated terms on our website.
            Your continued use of our services after such modifications
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may suspend or terminate your access to our services at any time
            for violation of these terms or for any other reason at our sole
            discretion. Upon termination, your right to use our services will
            immediately cease.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These terms shall be governed by and construed in accordance with the
            laws of the State of Delaware, United States, without regard to its
            conflict of law provisions.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms of Service, please contact
            us at{" "}
            <a href="mailto:support@docapi.co" className="text-primary hover:underline">
              support@docapi.co
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
