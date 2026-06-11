import React, { useState } from "react";
import { Switch } from "@mui/material";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface VendorStatusToggleProps {
  id: number;
  status: "active" | "inactive";
  onChange: (id: number) => Promise<void>;
  disabled?: boolean;
}

export function VendorStatusToggle({
  id,
  status,
  onChange,
  disabled = false,
}: VendorStatusToggleProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = status === "active";

  const handleToggleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    setLoading(true);
    try {
      await onChange(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dialogMessage = isActive
    ? "Disabling this vendor will suspend their account and ALL linked employees and customers. They will not be able to login until re-enabled. Are you sure?"
    : "This will re-activate the vendor and all their employees and customers. Confirm?";

  return (
    <>
      <Switch
        checked={isActive}
        onChange={handleToggleClick}
        disabled={disabled || loading}
        color="primary"
        size="small"
      />
      <ConfirmDialog
        open={open}
        title={isActive ? "Disable Vendor" : "Enable Vendor"}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
        confirmText={isActive ? "Disable" : "Enable"}
        isDanger={isActive}
      />
    </>
  );
}
export default VendorStatusToggle;
