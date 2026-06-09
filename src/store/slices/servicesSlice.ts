import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Service } from "@/data/servicesData";
import { servicesApi } from "@/services/api/servicesApi";

interface ServicesState {
  services: Service[];
  searchQuery: string;
  categoryFilter: string;
  locationFilter: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    published: number;
    pending: number;
    draft: number;
  };
}

const initialState: ServicesState = {
  services: [],
  searchQuery: "",
  categoryFilter: "all",
  locationFilter: "all",
  statusFilter: "all",
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  loading: false,
  error: null,
  stats: {
    total: 0,
    published: 0,
    pending: 0,
    draft: 0,
  },
};

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).services as ServicesState;
      const params = {
        search: state.searchQuery || undefined,
        category: state.categoryFilter === "all" ? undefined : state.categoryFilter,
        status: state.statusFilter === "all" ? undefined : state.statusFilter,
        page: state.currentPage,
      };
      const response = await servicesApi.getAllServices(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch services");
    }
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async (data: Partial<Service>, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesApi.createService(data);
      dispatch(fetchServices());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create service");
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ id, data }: { id: string | number; data: Partial<Service> }, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesApi.updateService(id, data);
      dispatch(fetchServices());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update service");
    }
  }
);

export const removeService = createAsyncThunk(
  "services/removeService",
  async (id: string | number, { dispatch, rejectWithValue }) => {
    try {
      await servicesApi.deleteService(id);
      dispatch(fetchServices());
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete service");
    }
  }
);

export const toggleServiceFeatured = createAsyncThunk(
  "services/toggleServiceFeatured",
  async (id: string | number, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesApi.toggleFeatured(id);
      dispatch(fetchServices());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle featured status");
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  "services/toggleServiceStatus",
  async (id: string | number, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesApi.toggleStatus(id);
      dispatch(fetchServices());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle status");
    }
  }
);

const slice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setSearch: (s, a: PayloadAction<string>) => {
      s.searchQuery = a.payload;
      s.currentPage = 1;
    },
    setCategory: (s, a: PayloadAction<string>) => {
      s.categoryFilter = a.payload;
      s.currentPage = 1;
    },
    setLocation: (s, a: PayloadAction<string>) => {
      s.locationFilter = a.payload;
      s.currentPage = 1;
    },
    setStatus: (s, a: PayloadAction<string>) => {
      s.statusFilter = a.payload;
      s.currentPage = 1;
    },
    setPage: (s, a: PayloadAction<number>) => {
      s.currentPage = a.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchServices.fulfilled, (s, a) => {
        s.loading = false;
        s.services = a.payload.data;
        s.totalCount = a.payload.total;
        s.totalPages = a.payload.last_page;
        if (a.payload.stats) {
          s.stats = a.payload.stats;
        }
      })
      .addCase(fetchServices.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export const { setSearch, setCategory, setLocation, setStatus, setPage } = slice.actions;
export default slice.reducer;
