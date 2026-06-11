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
import type { Employee } from "@/types/vendor";
import { toast } from "sonner";

interface EmployeeTableProps {
  vendorId: number;
}

export function EmployeeTable({ vendorId }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vendorService.getVendorEmployees(vendorId, {
        page: page + 1,
        per_page: rowsPerPage,
      });
      setEmployees(response.data);
      setTotalCount(response.meta.total);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [vendorId, page, rowsPerPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleToggleStatus = async (employeeId: number, currentStatus: boolean) => {
    // Optimistic UI update
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, is_active: !currentStatus } : e)),
    );

    try {
      await vendorService.toggleEmployeeStatus(vendorId, employeeId);
      toast.success("Employee status updated successfully");
    } catch (err) {
      // Revert on failure
      setEmployees((prev) =>
        prev.map((e) => (e.id === employeeId ? { ...e, is_active: currentStatus } : e)),
      );
      toast.error("Failed to update employee status");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && employees.length === 0) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress size={40} sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (employees.length === 0) {
    return (
      <Box className="text-center py-12 text-[#6B7280]">No employees found for this vendor.</Box>
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
              <TableCell>Designation</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((e, index) => (
              <TableRow
                key={e.id}
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
                <TableCell sx={{ fontWeight: 700, color: "#111827" }}>
                  {e.name || `${e.first_name} ${e.last_name}`}
                </TableCell>
                <TableCell sx={{ color: "#4B5563" }}>{e.email}</TableCell>
                <TableCell sx={{ color: "#4B5563" }}>{e.phone || e.mobile_number || "-"}</TableCell>
                <TableCell sx={{ color: "#4B5563" }}>{e.designation || "-"}</TableCell>
                <TableCell sx={{ color: "#4B5563" }}>{e.department || "-"}</TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <Switch
                      checked={e.is_active}
                      onChange={() => handleToggleStatus(e.id, e.is_active)}
                      color="primary"
                      size="small"
                    />
                    <span
                      className={`text-xs font-bold ${e.is_active ? "text-green-600" : "text-gray-400"}`}
                    >
                      {e.is_active ? "Active" : "Inactive"}
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
export default EmployeeTable;
