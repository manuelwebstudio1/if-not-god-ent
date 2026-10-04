import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { listCategoriesWithCounts } from "@/lib/products/repository";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await listCategoriesWithCounts().catch(() => []);

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}
