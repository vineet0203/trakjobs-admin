import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
} from "@mui/material";
import { Save, User, Users, Briefcase } from "lucide-react";
import { EmployeeTable } from "./EmployeeTable";
import { CustomerTable } from "./CustomerTable";
import { vendorService } from "@/services/vendorService";
import type { Vendor } from "@/types/vendor";
import { toast } from "sonner";

interface VendorDetailTabsProps {
  vendor: Vendor;
  onUpdate: (updatedVendor: Vendor) => void;
}

export function VendorDetailTabs({ vendor, onUpdate }: VendorDetailTabsProps) {
  const [tabValue, setTabValue] = useState(0);

  // Form State
  const [businessName, setBusinessName] = useState(vendor.business_name);
  const [websiteName, setWebsiteName] = useState(vendor.website_name || "");
  const [businessType, setBusinessType] = useState(vendor.business_type || "");
  const [fullName, setFullName] = useState(vendor.full_name);
  const [email, setEmail] = useState(vendor.email);
  const [mobileNumber, setMobileNumber] = useState(vendor.mobile_number || "");
  const [serviceCategory, setServiceCategory] = useState(vendor.service_category || "");
  const [serviceSubCategory, setServiceSubCategory] = useState(vendor.service_sub_category || "");
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(vendor.is_accepting_bookings);

  const [saving, setSaving] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await vendorService.updateVendor(vendor.id, {
        business_name: businessName,
        website_name: websiteName,
        business_type: businessType,
        full_name: fullName,
        email,
        mobile_number: mobileNumber,
        service_category: serviceCategory,
        service_sub_category: serviceSubCategory,
        is_accepting_bookings: isAcceptingBookings,
      });
      onUpdate(updated);
      toast.success("Profile updated successfully");
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              color: "#6B7280",
              "&.Mui-selected": {
                color: "#7C3AED",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#7C3AED",
            },
          }}
        >
          <Tab icon={<User size={16} />} iconPosition="start" label="Profile" />
          <Tab icon={<Briefcase size={16} />} iconPosition="start" label="Employees" />
          <Tab icon={<Users size={16} />} iconPosition="start" label="Customers" />
        </Tabs>
      </Box>

      {/* Profile Tab */}
      {tabValue === 0 && (
        <Paper
          component="form"
          onSubmit={handleSaveProfile}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "none",
            bgcolor: "#fff",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Website URL"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Business Type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Owner Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Owner Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Service Category"
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Service Sub Category"
                value={serviceSubCategory}
                onChange={(e) => setServiceSubCategory(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAcceptingBookings}
                    onChange={(e) => setIsAcceptingBookings(e.target.checked)}
                    color="primary"
                  />
                }
                label="Accepting Bookings"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<Save size={16} />}
                sx={{
                  bgcolor: "#7C3AED",
                  "&:hover": { bgcolor: "#6D28D9" },
                  height: 40,
                  px: 3,
                  boxShadow: "0 4px 12px -2px rgba(124,58,237,.3)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Employees Tab */}
      {tabValue === 1 && <EmployeeTable vendorId={vendor.id} />}

      {/* Customers Tab */}
      {tabValue === 2 && <CustomerTable vendorId={vendor.id} />}
    </Box>
  );
}
export default VendorDetailTabs;
