import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { VendorDetailPage } from "@/pages/VendorDetail";

export const Route = createFileRoute("/vendors/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return (
    <MainLayout>
      <VendorDetailPage id={Number(id)} />
    </MainLayout>
  );
}
