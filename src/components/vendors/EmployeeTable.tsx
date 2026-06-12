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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { vendorService } from "@/services/vendorService";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
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

  // Dialog & Form states
  const [openDialog, setOpenDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formSaving, setFormSaving] = useState(false);

  // Deletion states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const handleCreateOpen = () => {
    setEditEmployee(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobileNumber("");
    setDesignation("");
    setDepartment("");
    setIsActive(true);
    setOpenDialog(true);
  };

  const handleEditOpen = (emp: Employee) => {
    setEditEmployee(emp);
    setFirstName(emp.first_name || emp.name?.split(" ")[0] || "");
    setLastName(emp.last_name || emp.name?.split(" ").slice(1).join(" ") || "");
    setEmail(emp.email);
    setMobileNumber(emp.phone || "");
    setDesignation(emp.designation || "");
    setDepartment(emp.department || "");
    setIsActive(emp.is_active);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        mobile_number: mobileNumber,
        designation,
        department,
        is_active: isActive,
      };

      if (editEmployee) {
        await vendorService.updateVendorEmployee(vendorId, editEmployee.id, payload);
        toast.success("Employee updated successfully");
      } else {
        await vendorService.addVendorEmployee(vendorId, payload);
        toast.success("Employee created successfully. Setup email sent.");
      }
      setOpenDialog(false);
      fetchEmployees();
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to save employee");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await vendorService.deleteVendorEmployee(vendorId, deleteId);
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (err) {
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(apiErr.response?.data?.message || "Failed to delete employee");
      }
    }
    setDeleteOpen(false);
  };

  const handleClose = () => {
    if (!formSaving) {
      setOpenDialog(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Paper
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={handleCreateOpen}
            sx={{
              bgcolor: "#7C3AED",
              "&:hover": { bgcolor: "#6D28D9" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Employee
          </Button>
        </Box>

        {loading && employees.length === 0 ? (
          <Box className="flex justify-center items-center py-12">
            <CircularProgress size={40} sx={{ color: "#7C3AED" }} />
          </Box>
        ) : employees.length === 0 ? (
          <Box className="text-center py-12 text-[#6B7280]">
            No employees found for this vendor.
          </Box>
        ) : (
          <>
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
                    <TableCell align="right" sx={{ pr: 3 }}>
                      Actions
                    </TableCell>
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
                      <TableCell sx={{ color: "#4B5563" }}>{e.phone || "-"}</TableCell>
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
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip title="Edit Employee">
                            <IconButton size="small" onClick={() => handleEditOpen(e)}>
                              <Pencil size={16} className="text-[#7C3AED]" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Employee">
                            <IconButton size="small" onClick={() => handleDeleteClick(e.id)}>
                              <Trash2 size={16} className="text-red-500" />
                            </IconButton>
                          </Tooltip>
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
          </>
        )}
      </Paper>

      {/* Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1.5,
              width: "100%",
              maxWidth: 600,
            },
          },
        }}
      >
        <DialogTitle className="font-extrabold text-[#111827]">
          {editEmployee ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 1.5 }}>
            <Button onClick={handleClose} disabled={formSaving} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formSaving}
              sx={{
                bgcolor: "#7C3AED",
                "&:hover": { bgcolor: "#6D28D9" },
                textTransform: "none",
              }}
            >
              {formSaving ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteOpen(false)}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
export default EmployeeTable;
