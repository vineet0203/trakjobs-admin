import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { KeyRound, Copy, Check } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";

interface VendorResetPasswordProps {
  id: number;
  email: string;
  onSuccess?: () => void;
}

export function VendorResetPassword({ id, email, onSuccess }: VendorResetPasswordProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      const response = await vendorService.resetVendorPassword(id);
      setNewPassword(response.new_password);
      setResultOpen(true);
      if (onSuccess) onSuccess();
      toast.success("Password reset successful");
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    toast.success("Password copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<KeyRound size={14} />}
        onClick={handleResetClick}
        disabled={loading}
        sx={{
          textTransform: "none",
          borderColor: "#EDE9FE",
          color: "#7C3AED",
          "&:hover": { borderColor: "#DDD6FE", bgcolor: "#F5F3FF" },
        }}
      >
        Reset Password
      </Button>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Reset Password"
        message={`This will generate a new temporary password and email it to ${email}. They will be required to change it on next login. Confirm?`}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
        confirmText="Confirm Reset"
        isDanger={true}
      />

      {/* New Password Display Dialog */}
      <Dialog
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1.5,
              width: "100%",
              maxWidth: 400,
            },
          },
        }}
      >
        <DialogTitle className="font-extrabold text-[#111827]">
          Temporary Password Generated
        </DialogTitle>
        <DialogContent>
          <Typography className="text-gray-600 text-sm mb-4">
            The password has been updated and sent to the vendor. You can also copy it to share it
            manually.
          </Typography>
          <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg font-mono text-lg font-bold text-gray-800 break-all select-all">
            <span>{newPassword}</span>
            <Button
              size="small"
              onClick={handleCopy}
              sx={{ minWidth: 40, p: 1, color: copied ? "#16A34A" : "#7C3AED" }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1.5 }}>
          <Button
            onClick={() => setResultOpen(false)}
            variant="contained"
            sx={{ bgcolor: "#7C3AED", "&:hover": { bgcolor: "#6D28D9" } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default VendorResetPassword;
