import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardReport } from "./DashboardReport";
import { CopyLinkBanner } from "./CopyLinkBanner";

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
        <DashboardWelcome />
        <CopyLinkBanner slug={slug} />
        <DashboardReport slug={slug} />
      </div>
    </main>
  );
}