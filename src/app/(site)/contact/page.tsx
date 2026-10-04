import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, WhatsApp or visit IF NOT GOD ENT in Accra for building materials, water pumps and machines.",
};

const input =
  "w-full border border-neutral-300 bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/30";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string; sent?: string; error?: string }>;
}) {
  const { newsletter, sent, error } = await searchParams;
  const whatsappHelp = buildWhatsAppUrl(
    `Hello ${siteConfig.name}, I need help finding the right equipment.`,
  );
  const whatsappGeneral = buildWhatsAppUrl(
    `Hello ${siteConfig.name}, I would like assistance with your products.`,
  );

  return (
    <div className="bg-white">
      <section className="relative isolate min-h-[62vh] overflow-hidden text-white lg:min-h-[70vh]">
        <Image
          src="/images/contact/hero.jpg"
          alt="Industrial supply yard at dusk"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

        <div className="ing-container relative flex min-h-[62vh] flex-col justify-end pb-16 pt-28 lg:min-h-[70vh] lg:pb-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold">
            Get in touch
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
            Talk to
            <span className="block text-gold">the supply desk.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">
            Product specialists in Accra ready to help with stock, bulk orders
            and the right machine for the job.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:233502889487" className={cn(buttonVariants())}>
              Call +233 50 288 9487
            </a>
            <a
              href={whatsappHelp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              WhatsApp an expert
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-800 bg-black py-10 text-white">
        <div className="ing-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Phone,
              label: "Phone",
              value: "+233 50 288 9487",
              href: "tel:233502889487",
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "+233 50 288 9487",
              href: whatsappGeneral,
            },
            {
              icon: Mail,
              label: "Email",
              value: siteConfig.email,
              href: `mailto:${siteConfig.email}`,
            },
            {
              icon: Clock3,
              label: "Hours",
              value: siteConfig.businessHours,
            },
          ].map((item) => (
            <div key={item.label} className="border border-white/10 bg-white/5 p-5">
              <item.icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-1 block text-sm text-white hover:text-gold"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 text-sm text-white">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="ing-container grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            Visit us
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
            Accra, Ghana
          </h2>
          <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {siteConfig.address}
          </p>
          <div className="mt-8 aspect-[4/3] w-full overflow-hidden border border-neutral-200 bg-neutral-200">
            <iframe
              title="Map of Accra, Ghana"
              className="h-full w-full border-0 grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62297901187!2d-0.236489!3d5.603717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfd79f997214ad659%3A0xf6df1b7a4f316bfa!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000"
            />
          </div>
        </div>

        <div>
          {newsletter === "success" && (
            <p className="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Thank you for subscribing to our newsletter.
            </p>
          )}
          {sent === "1" && (
            <p className="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Message received. Our team will get back to you shortly.
            </p>
          )}
          {error === "1" && (
            <p className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Please enter a valid name and email, then try again.
            </p>
          )}

          <form
            action="/api/contact"
            method="post"
            className="space-y-4 border border-neutral-200 bg-white p-6 shadow-sm lg:p-8"
          >
            <h2 className="text-lg font-black uppercase">Send a message</h2>
            <p className="text-sm text-muted">
              Tell us about the project and we will recommend the right stock.
            </p>
            <input name="name" required placeholder="Name" className={input} />
            <input name="email" type="email" required placeholder="Email" className={input} />
            <input name="phone" placeholder="Phone" className={input} />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="How can we help?"
              className={input}
            />
            <button type="submit" className={cn(buttonVariants(), "w-full")}>
              Submit message
            </button>
          </form>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-14 text-white">
        <Image
          src="/images/contact/hero.jpg"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="ing-container relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
              Need the right equipment?
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
              Talk to a product specialist
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-quote" className={cn(buttonVariants())}>
              Request a quote
            </Link>
            <a
              href={whatsappHelp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
