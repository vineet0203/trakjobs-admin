import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 400,
          },
        },
      }}
    >
      <DialogTitle
        className={`flex items-center gap-2 font-bold ${isDanger ? "text-red-600" : "text-[#7C3AED]"}`}
      >
        {isDanger && <AlertTriangle size={20} className="text-red-500" />}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="text-gray-600">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#E5E7EB",
            color: "#4B5563",
            "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={isDanger ? "error" : "primary"}
          sx={{
            bgcolor: isDanger ? "#EF4444" : "#7C3AED",
            "&:hover": { bgcolor: isDanger ? "#DC2626" : "#6D28D9" },
            boxShadow: isDanger ? "none" : "0 4px 12px -2px rgba(124,58,237,.3)",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmDialog;
