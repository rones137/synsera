import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HomePage } from "@/components/marketing/home-page";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNav />
      <main className="flex-1">
        <HomePage />
      </main>
      <MarketingFooter />
    </div>
  );
}
