import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import {
  Button,
  Avatar,
  Box,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errorUtils";
import AnalyticsPage from "./AnalyticsPage";

const ItemsTable = ({ tableRef, onEdit, onDelete }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const [searchField, setSearchField] = useState("ItemName");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    api.get("/items/suppliers")
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(error => {
        setSnackbar({ open: true, message: `Failed to load suppliers: ${getErrorMessage(error)}`, severity: "error" });
      });
  }, []);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleSupplierFilterChange = (event) => {
    const supplierName = event.target.value;
    setSelectedSupplier(supplierName);
    if (tableRef.current) {
        tableRef.current.onQueryChange();
    }
  };

  return (
    <>
      {/* FIX: This container now aligns the controls to the right end of the screen */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        {/* FIX: "Filter by Supplier" now comes first */}
        <FormControl fullWidth variant="outlined" sx={{ maxWidth: '250px' }}>
          <InputLabel>Filter by Supplier</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={handleSupplierFilterChange}
            label="Filter by Supplier"
          >
            <MenuItem value="">
              <em>None (Show All)</em>
            </MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.UserID} value={supplier.Username}>
                {supplier.Username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* FIX: "Search By" now comes second */}
        <FormControl fullWidth variant="outlined" sx={{ maxWidth: '250px' }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            label="Search By"
            disabled={!!selectedSupplier}
          >
            <MenuItem value="ItemName">Item Name</MenuItem>
            <MenuItem value="SupplierName">Supplier Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <MaterialTable
        title="Inventory Management"
        tableRef={tableRef}
        columns={[
            { title: "Item Name", field: "name" },
            { title: "Price (₹)", field: "price", type: "currency", currencySetting: { currencyCode: 'INR' }},
            { title: "Quantity", field: "quantity" },
            { title: "Supplier", field: "supplierName" },
            {
              title: "Photo",
              field: "imagePath",
              render: (rowData) => (
                <Avatar src={`http://localhost:5268${rowData.imagePath}`} alt={rowData.name} variant="rounded" />
              ),
            },
        ]}
        data={(query) =>
          new Promise((resolve, reject) => {
            const isFilteringBySupplier = !!selectedSupplier;
            
            const params = {
              pageNumber: query.page + 1,
              pageSize: query.pageSize,
              searchTerm: isFilteringBySupplier ? selectedSupplier : query.search,
              searchField: isFilteringBySupplier ? 'SupplierName' : searchField,
            };

            api.get("/items", { params })
              .then((result) => resolve({ data: result.data.items, page: query.page, totalCount: result.data.totalCount }))
              .catch((error) => {
                setSnackbar({ open: true, message: getErrorMessage(error), severity: "error" });
                reject(error);
              });
          })
        }
        actions={[
          { icon: () => <EditIcon />, tooltip: "Edit Item", onClick: (event, rowData) => onEdit(rowData) },
          { icon: () => <DeleteIcon color="error" />, tooltip: "Delete Item", onClick: (event, rowData) => onDelete(rowData) },
        ]}
        options={{ 
            actionsColumnIndex: -1, 
            search: !selectedSupplier, 
            paging: true, 
            headerStyle: { backgroundColor: "#f5f5f5", fontWeight: "bold" } 
        }}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
          </Alert>
      </Snackbar>
    </>
  );
};

export default function AdminDashboard() {
  const tableRef = useRef();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = (rowData) => navigate(`/admin/item/edit/${rowData.itemID}`);

  const handleDelete = (rowData) => {
    if (window.confirm(`Are you sure you want to delete ${rowData.name}?`)) {
        api.delete(`/items/${rowData.itemID}`)
          .then(() => {
              if (tableRef.current) tableRef.current.onQueryChange();
          })
          .catch((error) => console.error("Delete failed:", getErrorMessage(error)));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Inventory" />
          <Tab label="Analytics" />
        </Tabs>
        {activeTab === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/item/new")}
            sx={{ mr: 2 }}
          >
            Add New Item
          </Button>
        )}
      </Box>

      <Box sx={{ pt: 3 }}>
        {activeTab === 0 && (
            <ItemsTable 
                tableRef={tableRef}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        )}
        {activeTab === 1 && <AnalyticsPage />}
      </Box>
    </Box>
  );
}