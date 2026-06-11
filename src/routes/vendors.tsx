import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { VendorsPage } from "@/pages/Vendors";

export const Route = createFileRoute("/vendors")({
  component: Page,
});

function Page() {
  return (
    <MainLayout>
      <VendorsPage />
    </MainLayout>
  );
}
