import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { Eye, Trash2 } from "lucide-react";
import { VendorStatusBadge } from "./VendorStatusBadge";
import { VendorStatusToggle } from "./VendorStatusToggle";
import { VendorResetPassword } from "./VendorResetPassword";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { format } from "date-fns";
import type { Vendor } from "@/types/vendor";

interface VendorTableProps {
  vendors: Vendor[];
  onToggleStatus: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  page: number;
  rowsPerPage: number;
}

export function VendorTable({
  vendors,
  onToggleStatus,
  onDelete,
  page,
  rowsPerPage,
}: VendorTableProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
    }
    setDeleteOpen(false);
  };

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
        <Table sx={{ minWidth: 1100 }}>
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
                #
              </TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Owner Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Service Category</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Employees</TableCell>
              <TableCell align="center">Customers</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right" sx={{ pr: 3 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!vendors || vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 6, color: "#6B7280" }}>
                  No vendors found.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((v, index) => {
                const joinedDate = v.created_at ? new Date(v.created_at) : new Date();
                return (
                  <TableRow
                    key={v.id}
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
                      {v.business_name}
                    </TableCell>
                    <TableCell sx={{ color: "#374151", fontWeight: 600 }}>{v.full_name}</TableCell>
                    <TableCell sx={{ color: "#4B5563" }}>{v.email}</TableCell>
                    <TableCell sx={{ color: "#4B5563" }}>{v.mobile_number || "-"}</TableCell>
                    <TableCell sx={{ color: "#4B5563", textTransform: "capitalize" }}>
                      {v.service_category?.replace("_", " ") || "-"}
                    </TableCell>
                    <TableCell align="center">
                      <VendorStatusBadge status={v.status} />
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#374151", fontWeight: 600 }}>
                      {v.employee_count}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#374151", fontWeight: 600 }}>
                      {v.customer_count}
                    </TableCell>
                    <TableCell sx={{ color: "#6B7280", fontSize: 13 }}>
                      {format(joinedDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <div className="flex items-center justify-end gap-2">
                        <VendorStatusToggle id={v.id} status={v.status} onChange={onToggleStatus} />
                        <VendorResetPassword id={v.id} email={v.email} />
                        <Tooltip title="View / Edit">
                          <Link to="/vendors/$id" params={{ id: String(v.id) }}>
                            <IconButton size="small">
                              <Eye size={16} className="text-[#7C3AED]" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete Vendor">
                          <IconButton size="small" onClick={() => handleDeleteClick(v.id)}>
                            <Trash2 size={16} className="text-red-500" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Vendor"
        message="Are you sure you want to permanently delete this vendor? This will suspend all associated user accounts and soft delete their profile."
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteOpen(false)}
        confirmText="Delete"
        isDanger={true}
      />
    </Paper>
  );
}
export default VendorTable;
