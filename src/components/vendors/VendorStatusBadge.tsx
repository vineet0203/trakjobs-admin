import { Chip } from "@mui/material";

const map: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "#E6F4EA", color: "#137333", label: "Active" },
  inactive: { bg: "#FCE8E6", color: "#C5221F", label: "Inactive" },
};

export function VendorStatusBadge({ status }: { status: "active" | "inactive" | string }) {
  const s = map[status] ?? { bg: "#F1F3F4", color: "#5F6368", label: status };
  return (
    <Chip
      size="small"
      label={s.label}
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 700,
        fontSize: 11,
        height: 22,
        px: 0.5,
        textTransform: "uppercase",
      }}
    />
  );
}
export default VendorStatusBadge;
