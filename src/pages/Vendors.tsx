import React, { useState, useEffect, useCallback } from "react";
import {
  Breadcrumbs,
  CircularProgress,
  TextField,
  MenuItem,
  Box,
  TablePagination,
} from "@mui/material";
import { ChevronRight, Search, X } from "lucide-react";
import { vendorService } from "@/services/vendorService";
import { VendorTable } from "@/components/vendors/VendorTable";
import type { Vendor } from "@/types/vendor";
import { toast } from "sonner";

export function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce Search Query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset to first page on search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vendorService.getVendors({
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: page + 1,
        per_page: rowsPerPage,
      });
      setVendors(response.data);
      setTotalCount(response.meta.total);
    } catch (err) {
      toast.error("Failed to retrieve vendors data.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page, rowsPerPage]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleToggleStatus = async (id: number) => {
    const target = vendors.find((v) => v.id === id);
    if (!target) return;

    const oldStatus = target.status;
    const nextStatus = oldStatus === "active" ? "inactive" : "active";

    // Optimistic UI update
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status: nextStatus } : v)));

    try {
      await vendorService.toggleVendorStatus(id);
      toast.success(`Vendor ${nextStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      // Revert status
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status: oldStatus } : v)));
      toast.error("Failed to toggle vendor status");
    }
  };

  const handleDelete = async (id: number) => {
    const oldVendors = [...vendors];

    // Optimistic delete
    setVendors((prev) => prev.filter((v) => v.id !== id));

    try {
      await vendorService.deleteVendor(id);
      toast.success("Vendor deleted successfully");
    } catch (err) {
      // Revert list
      setVendors(oldVendors);
      toast.error("Failed to delete vendor");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#111827] leading-tight">Vendors</h1>
          <Breadcrumbs
            separator={<ChevronRight size={14} className="text-[#9CA3AF]" />}
            sx={{ mt: 0.5, fontSize: 13 }}
          >
            <span style={{ color: "#7C3AED", fontWeight: 600, cursor: "pointer" }}>Dashboard</span>
            <span style={{ color: "#7C3AED", fontWeight: 600, cursor: "pointer" }}>Vendors</span>
            <span style={{ color: "#6B7280" }}>All Vendors</span>
          </Breadcrumbs>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "#fff",
          p: 2,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search by business, email, owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            flex: 1,
            minWidth: 260,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          slotProps={{
            input: {
              startAdornment: <Search size={18} className="text-[#9CA3AF] mr-2" />,
              endAdornment: searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#9CA3AF] hover:text-[#111827]"
                >
                  <X size={16} />
                </button>
              ),
            },
          }}
        />

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{
            width: 150,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Box>

      {loading && vendors.length === 0 ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-gray-100 min-h-[300px]">
          <CircularProgress size={40} sx={{ color: "#7C3AED" }} />
        </div>
      ) : (
        <>
          <VendorTable
            vendors={vendors}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
          />
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 3,
              mt: -2,
            }}
          />
        </>
      )}
    </div>
  );
}
export default VendorsPage;
