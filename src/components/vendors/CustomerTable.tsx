import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  CircularProgress,
  TablePagination,
  Box,
} from "@mui/material";
import { vendorService } from "@/services/vendorService";
import type { Customer } from "@/types/vendor";
import { toast } from "sonner";

interface CustomerTableProps {
  vendorId: number;
}

export function CustomerTable({ vendorId }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vendorService.getVendorCustomers(vendorId, {
        page: page + 1,
        per_page: rowsPerPage,
      });
      setCustomers(response.data);
      setTotalCount(response.meta.total);
    } catch (err) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [vendorId, page, rowsPerPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleToggleStatus = async (
    customerId: number,
    currentStatus: "active" | "inactive" | string,
  ) => {
    const nextStatus = (currentStatus === "active" ? "inactive" : "active") as
      | "active"
      | "inactive";

    // Optimistic UI update
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: nextStatus } : c)),
    );

    try {
      await vendorService.toggleCustomerStatus(vendorId, customerId);
      toast.success("Customer status updated successfully");
    } catch (err) {
      // Revert on failure
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId ? { ...c, status: currentStatus as "active" | "inactive" } : c,
        ),
      );
      toast.error("Failed to update customer status");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && customers.length === 0) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress size={40} sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (customers.length === 0) {
    return (
      <Box className="text-center py-12 text-[#6B7280]">No customers found for this vendor.</Box>
    );
  }

  return (
    <Paper
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: "none",
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  bgcolor: "#fff",
                  borderColor: "#E5E7EB",
                  color: "#6B7280",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                  py: 1.5,
                },
              }}
            >
              <TableCell width={60} align="center">
                No.
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c, index) => (
              <TableRow
                key={c.id}
                sx={{
                  "&:hover": { bgcolor: "#F9FAFB" },
                  "& td": { borderColor: "#F3F4F6", py: 1.5 },
                }}
              >
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "#F3E8FF",
                      color: "#7C3AED",
                      fontSize: 12,
                      fontWeight: 700,
                      mx: "auto",
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#111827" }}>{c.name}</TableCell>
                <TableCell sx={{ color: "#4B5563" }}>{c.email}</TableCell>
                <TableCell sx={{ color: "#4B5563" }}>{c.phone || "-"}</TableCell>
                <TableCell sx={{ color: "#4B5563", textTransform: "capitalize" }}>
                  {c.role || "Customer"}
                </TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <Switch
                      checked={c.status === "active"}
                      onChange={() => handleToggleStatus(c.id, c.status)}
                      color="primary"
                      size="small"
                    />
                    <span
                      className={`text-xs font-bold ${c.status === "active" ? "text-green-600" : "text-gray-400"}`}
                    >
                      {c.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: "1px solid #E5E7EB" }}
      />
    </Paper>
  );
}
export default CustomerTable;
