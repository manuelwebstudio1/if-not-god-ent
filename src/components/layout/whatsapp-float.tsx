"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/233502889487?text=" +
  encodeURIComponent(
    "Hello IF NOT GOD ENT, I would like assistance with your products and services.",
  );

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 lg:bottom-6"
      aria-label="Chat on WhatsApp +233 50 288 9487"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
}
