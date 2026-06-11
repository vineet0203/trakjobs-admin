import React, { useState, useEffect, useCallback } from "react";
import { Breadcrumbs, CircularProgress, Box, Typography, Paper } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { vendorService } from "@/services/vendorService";
import { VendorDetailTabs } from "@/components/vendors/VendorDetailTabs";
import type { Vendor } from "@/types/vendor";
import { toast } from "sonner";

interface VendorDetailPageProps {
  id: number;
}

export function VendorDetailPage({ id }: VendorDetailPageProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vendorService.getVendor(id);
      setVendor(data);
    } catch (err) {
      toast.error("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const handleUpdate = (updatedVendor: Vendor) => {
    setVendor(updatedVendor);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20 min-h-[400px]">
        <CircularProgress size={40} sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box className="text-center py-20 text-[#6B7280]">Vendor not found or has been deleted.</Box>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#111827] leading-tight">
            {vendor.business_name}
          </h1>
          <Breadcrumbs
            separator={<ChevronRight size={14} className="text-[#9CA3AF]" />}
            sx={{ mt: 0.5, fontSize: 13 }}
          >
            <Link
              to="/services"
              style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}
            >
              Dashboard
            </Link>
            <Link
              to="/vendors"
              style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}
            >
              Vendors
            </Link>
            <span style={{ color: "#6B7280" }}>{vendor.business_name}</span>
          </Breadcrumbs>
        </div>
      </div>

      <Paper
        sx={{
          p: 3,
          border: "1px solid #E5E7EB",
          borderRadius: 3,
          boxShadow: "none",
          bgcolor: "#fff",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
              {vendor.business_name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
              Owner: <span className="font-bold text-gray-800">{vendor.full_name}</span> &bull;
              Email: <span className="font-bold text-gray-800">{vendor.email}</span>
            </Typography>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Typography
                variant="caption"
                sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}
              >
                Employees
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#7C3AED" }}>
                {vendor.employee_count}
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="caption"
                sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}
              >
                Customers
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#7C3AED" }}>
                {vendor.customer_count}
              </Typography>
            </div>
          </div>
        </div>
      </Paper>

      <VendorDetailTabs vendor={vendor} onUpdate={handleUpdate} />
    </div>
  );
}
export default VendorDetailPage;
