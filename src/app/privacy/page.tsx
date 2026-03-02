import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - DocAPI",
  description:
    "Privacy Policy for DocAPI PDF generation API, free tools, and AI agent programmatic registration.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 2, 2026</p>
      </div>

      <div className="space-y-8">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            DocAPI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our services, including our API, free tools,
            and programmatic agent registration. It applies equally to human users and
            to AI agents or automated systems registering and operating on behalf of a
            person or organization.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">2. Information We Collect</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.1 Account Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account via our sign-up flow, we collect your email
                address and any other information you provide during registration. For
                agent accounts registered via <code>POST /api/register</code>, an email
                address is either provided by the registering agent or auto-generated
                (e.g., <code>agent-xxxx@docapi.co</code>). We also store an optional
                operator notification email (<code>notify_email</code>) if provided at
                registration, used solely to send low-balance credit alerts.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.2 Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect information about how you use our API, including API call
                counts, timestamps, and general usage patterns. This helps us improve
                our services and monitor for abuse. For agent accounts, we also track
                credit balance changes and topup history.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.3 Payment Information — Stripe (Human Accounts)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payment processing for monthly subscription plans is handled by Stripe.
                We do not store your credit card details on our servers. We store your
                Stripe customer ID to manage your subscription. Stripe&apos;s privacy policy
                governs the collection and use of your payment information.
              </p>
            </div>

            <div className="border-l-4 border-violet-500 pl-4">
              <h3 className="font-semibold mb-2">2.4 Payment Information — USDC (Agent Accounts)</h3>
              <p className="text-muted-foreground leading-relaxed">
                For agent accounts, we store the USDC wallet address associated with
                your account. This is a public blockchain address on Base mainnet,
                generated via Coinbase Developer Platform (CDP). We also store your
                current credit balance and the cumulative USDC received by your wallet.
                We do not store private keys — wallet custody is managed by Coinbase CDP.
                USDC transactions on Base are publicly visible on the blockchain.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-2">2.5 Free Tools (Invoice Generator)</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">We do not store any data you enter in our free tools.</strong>{" "}
                Information such as company details, client information, and invoice
                items are processed in real-time to generate your PDF and are immediately
                discarded. No invoice data is saved on our servers.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2.6 IP Address and Rate Limiting</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect IP addresses for rate limiting purposes (e.g., 5
                programmatic registrations per day per IP). IP addresses used for rate
                limiting are stored transiently in Vercel KV and are not linked to
                account records or used for any other purpose.
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
              <span>To process transactions and send billing information (Stripe for subscriptions; USDC webhooks for agent credits)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span>To send low-balance credit alerts to the <code>notify_email</code> address provided at agent registration (maximum once per 24 hours)</span>
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
          <h2 className="text-xl font-semibold mb-6">4. Blockchain Data</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Agent accounts use USDC on Base mainnet for payments. You should be aware of
            the following regarding blockchain data:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Public addresses:</strong> The USDC wallet address assigned to your agent account is a public blockchain address. Anyone can view the transaction history of this address on a block explorer.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Irreversible transactions:</strong> USDC transfers on Base are permanent once confirmed. We cannot reverse or recover funds sent to your wallet address.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Sweep transactions:</strong> DocAPI periodically transfers received USDC from agent wallets to a treasury address. These sweep transactions are publicly visible on-chain.</span>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">5. Data Retention</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">5.1 Account Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We retain your account information for as long as your account is active.
                If you delete your account, we will delete your personal information
                within 30 days, except where we are required to retain it for legal
                purposes. For agent accounts, credit balance and USDC address are
                retained for the lifetime of the account.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">5.2 API Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                HTML content submitted to our API for PDF generation is processed in
                real-time and not stored permanently. We may temporarily cache content
                for performance purposes, but this cache is cleared regularly.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-2">5.3 Free Tools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Data entered in our free tools (such as the Invoice Generator) is never
                stored. It exists only in your browser and during the brief PDF generation
                process.
              </p>
            </div>

            <div className="border-l-4 border-violet-500 pl-4">
              <h3 className="font-semibold mb-2">5.4 Rate Limiting Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                IP-based rate limit counters are stored transiently (24-hour TTL) in
                Vercel KV and are automatically deleted after expiry.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">6. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Stripe:</strong> For processing subscription payments. Stripe&apos;s privacy policy applies to data shared with them.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Coinbase Developer Platform (CDP):</strong> For generating and managing USDC wallet addresses for agent accounts. Coinbase&apos;s privacy policy applies to data shared with them.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Loops.so:</strong> For sending transactional email notifications (low-balance alerts) to the <code>notify_email</code> address provided at agent registration. Only the email address and credit balance data are shared.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Supabase:</strong> Our database provider, used to store account data, API keys, and credit balances.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</span>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">7. Cookies and Tracking</h2>
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
            Agent accounts accessing the API directly do not use cookies. Cookies apply
            only to browser-based interactions with our website. You can control cookies
            through your browser settings. Disabling cookies may affect the functionality
            of our web dashboard.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">8. Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect
            your information, including encryption in transit (HTTPS), secure API key
            management, and regular security reviews. Private keys for agent wallets
            are managed by Coinbase CDP and are not accessible to DocAPI. However, no
            method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">9. Your Rights</h2>
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
              <span><strong className="text-foreground">Deletion:</strong> Request deletion of your data. Note that on-chain blockchain data (USDC transactions) cannot be deleted as it is immutable by nature.</span>
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
          <h2 className="text-xl font-semibold mb-4">10. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our services are not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13. If you
            believe we have collected information from a child under 13, please contact
            us immediately.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">11. International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your information may be transferred to and processed in countries other
            than your own. We ensure appropriate safeguards are in place to protect
            your information in accordance with this privacy policy.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">12. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you
            of any changes by posting the new policy on this page and updating the
            &quot;Last updated&quot; date. Your continued use of our services after such
            changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
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
