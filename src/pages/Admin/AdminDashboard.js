import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { Button, Avatar, Box, Snackbar, Alert, Tabs, Tab } from "@mui/material";
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

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
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
            api.get("/items", {
                params: {
                  pageNumber: query.page + 1,
                  pageSize: query.pageSize,
                  searchTerm: query.search,
                  searchField: "ItemName",
                },
              })
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
        options={{ actionsColumnIndex: -1, search: true, paging: true, headerStyle: { backgroundColor: "#f5f5f5", fontWeight: "bold" } }}
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