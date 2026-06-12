import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";

interface VendorResetPasswordProps {
  id: number;
  email: string;
  onSuccess?: () => void;
}

export function VendorResetPassword({ id, email, onSuccess }: VendorResetPasswordProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setPassword("");
    setShowPassword(false);
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await vendorService.resetVendorPassword(id, password);
      toast.success("Password reset successfully. Vendor can now log in directly.");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<KeyRound size={14} />}
        onClick={handleOpen}
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

      <Dialog
        open={open}
        onClose={handleClose}
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
        <DialogTitle className="font-extrabold text-[#111827]">Reset Vendor Password</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography className="text-gray-600 text-sm mb-4">
              Enter a new custom password for the vendor owner account (<strong>{email}</strong>).
              They will be able to log in directly using this password.
            </Typography>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              size="small"
              error={password.length > 0 && password.length < 8}
              helperText={
                password.length > 0 && password.length < 8
                  ? "Password must be at least 8 characters long"
                  : ""
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end" size="small">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 1.5 }}>
            <Button onClick={handleClose} disabled={loading} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || password.length < 8}
              sx={{
                bgcolor: "#7C3AED",
                "&:hover": { bgcolor: "#6D28D9" },
                textTransform: "none",
              }}
            >
              {loading ? "Saving..." : "Save Password"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
export default VendorResetPassword;
