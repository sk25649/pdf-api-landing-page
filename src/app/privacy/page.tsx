import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - DocAPI",
  description:
    "Privacy Policy for DocAPI PDF generation API and free tools.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: December 25, 2024</p>
      </div>

      <div className="space-y-8">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            DocAPI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our services, including our API and free tools.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">2. Information We Collect</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.1 Account Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account, we collect your email address and any
                other information you provide during registration. This information
                is used to manage your account and provide our services.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.2 Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect information about how you use our API, including API calls,
                timestamps, and general usage patterns. This helps us improve our
                services and monitor for abuse.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.3 Payment Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payment processing is handled by Stripe. We do not store your credit
                card details on our servers. Stripe&apos;s privacy policy governs the
                collection and use of your payment information.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-2">2.4 Free Tools (Invoice Generator)</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">We do not store any data you enter in our free tools.</strong>{" "}
                Information such as company details, client information, and invoice
                items are processed in real-time to generate your PDF and are immediately
                discarded. No invoice data is saved on our servers.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">3. How We Use Your Information</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To provide and maintain our services</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To process transactions and send billing information</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To send service-related communications</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To monitor and analyze usage patterns to improve our services</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To detect, prevent, and address technical issues or abuse</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To comply with legal obligations</span>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">4. Data Retention</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">4.1 Account Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We retain your account information for as long as your account is active.
                If you delete your account, we will delete your personal information
                within 30 days, except where we are required to retain it for legal purposes.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">4.2 API Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                HTML content submitted to our API for PDF generation is processed in
                real-time and not stored permanently. We may temporarily cache content
                for performance purposes, but this cache is cleared regularly.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-2">4.3 Free Tools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Data entered in our free tools (such as the Invoice Generator) is never
                stored. It exists only in your browser and during the brief PDF generation
                process.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">5. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Service Providers:</strong> Third parties that help us operate our services (e.g., Stripe for payments, cloud hosting providers)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">6. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Maintain your session and authentication state</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Remember your preferences</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>Analyze website traffic and usage (via Vercel Analytics)</span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You can control cookies through your browser settings. Disabling cookies
            may affect the functionality of our services.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">7. Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect
            your information, including encryption in transit (HTTPS), secure API key
            management, and regular security reviews. However, no method of transmission
            over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">8. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Access:</strong> Request a copy of your personal data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Deletion:</strong> Request deletion of your data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Portability:</strong> Request transfer of your data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Objection:</strong> Object to certain processing of your data</span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            To exercise these rights, please contact us at{" "}
            <a href="mailto:support@docapi.co" className="text-primary hover:underline">
              support@docapi.co
            </a>.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our services are not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13. If you
            believe we have collected information from a child under 13, please contact
            us immediately.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your information may be transferred to and processed in countries other
            than your own. We ensure appropriate safeguards are in place to protect
            your information in accordance with this privacy policy.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">11. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you
            of any changes by posting the new policy on this page and updating the
            &quot;Last updated&quot; date. Your continued use of our services after such
            changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">12. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:support@docapi.co" className="text-primary hover:underline">
              support@docapi.co
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
