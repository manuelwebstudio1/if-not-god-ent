import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string }>;
}) {
  const { newsletter } = await searchParams;

  return (
    <div className="ing-container py-12 lg:grid lg:grid-cols-2 lg:gap-12">
      <div>
        <h1 className="text-3xl font-black uppercase">Contact Us</h1>
        <ul className="mt-6 space-y-4 text-sm">
          <li>
            <strong className="block text-xs uppercase text-muted">Phone</strong>
            <a href="tel:233502889487">+233 50 288 9487</a>
          </li>
          <li>
            <strong className="block text-xs uppercase text-muted">WhatsApp</strong>
            <a
              href={buildWhatsAppUrl(
                `Hello ${siteConfig.name}, I would like assistance with your products.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp +233 50 288 9487
            </a>
          </li>
          <li>
            <strong className="block text-xs uppercase text-muted">Email</strong>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
          <li>
            <strong className="block text-xs uppercase text-muted">Address</strong>
            {siteConfig.address}
          </li>
          <li>
            <strong className="block text-xs uppercase text-muted">Hours</strong>
            {siteConfig.businessHours}
          </li>
        </ul>

        <div className="mt-10 border border-neutral-200 bg-black p-6 text-white">
          <h2 className="text-lg font-black uppercase">
            Need Help Finding The Right Equipment?
          </h2>
          <p className="mt-2 text-sm text-neutral-300">
            Speak with a product specialist for recommendations tailored to your
            project.
          </p>
          <Link
            href={buildWhatsAppUrl(
              `Hello ${siteConfig.name}, I need help finding the right equipment.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-gold px-6 py-3 text-xs font-bold uppercase text-black"
          >
            Talk To An Expert
          </Link>
        </div>
      </div>

      <div>
        {newsletter === "success" && (
          <p className="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Thank you for subscribing to our newsletter.
          </p>
        )}
        <form
          action="/api/contact"
          method="post"
          className="space-y-4 border border-neutral-200 bg-white p-6"
        >
          <h2 className="text-sm font-black uppercase">Send a Message</h2>
          <input name="name" required placeholder="Name" className={input} />
          <input name="email" type="email" required placeholder="Email" className={input} />
          <input name="phone" placeholder="Phone" className={input} />
          <textarea name="message" required rows={5} placeholder="Message" className={input} />
          <button
            type="submit"
            className="w-full bg-black py-3 text-xs font-bold uppercase text-white"
          >
            Submit
          </button>
        </form>
        <div className="mt-6 aspect-video w-full bg-neutral-200">
          <iframe
            title="Map"
            className="h-full w-full border-0 grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62297901187!2d-0.236489!3d5.603717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfd79f997214ad659%3A0xf6df1b7a4f316bfa!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000"
          />
        </div>
      </div>
    </div>
  );
}

const input =
  "w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-gold";
