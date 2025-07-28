import React, { useState, createRef } from 'react';
import MaterialTable from '@material-table/core';
import { IconButton, Snackbar, Alert, Box, TextField, Tooltip } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import api from '../../api/axios';
import { getErrorMessage } from '../../utils/errorUtils';

const SupplierDashboard = () => {
    const tableRef = createRef();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    
    const [editingCell, setEditingCell] = useState({ rowId: null, field: null });
    const [editValue, setEditValue] = useState('');
    const [editError, setEditError] = useState('');

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleEditClick = (rowData, field) => {
        setEditingCell({ rowId: rowData.itemID, field });
        setEditValue(rowData[field]);
        setEditError('');
    };

    const handleCancelClick = () => {
        setEditingCell({ rowId: null, field: null });
        setEditError('');
    };

    const handleSaveClick = async (rowData) => {
        const numValue = parseFloat(editValue);

        if (isNaN(numValue) || String(editValue).trim() === '') {
            setEditError('Value must be a number.');
            return;
        }
        if (numValue < 0) {
            setEditError('Value cannot be negative.');
            return;
        }
        
        setEditError(''); 

        const payload = {
            price: editingCell.field === 'price' ? numValue : rowData.price,
            quantity: editingCell.field === 'quantity' ? numValue : rowData.quantity,
        };

        try {
            await api.put(`/items/supplier/${editingCell.rowId}`, payload);
            setSnackbar({ open: true, message: 'Item updated successfully!', severity: 'success' });
            handleCancelClick(); 
            if (tableRef.current) {
                tableRef.current.onQueryChange(); 
            }
        } catch (error) {
            setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
        }
    };

    const renderEditableCell = (rowData, field) => {
        const isEditing = editingCell.rowId === rowData.itemID && editingCell.field === field;

        if (isEditing) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        variant="standard"
                        size="small"
                        autoFocus
                        error={!!editError}
                        helperText={editError}
                        sx={{ minWidth: '80px' }}
                        inputProps={{ step: field === 'price' ? '0.01' : '1' }}
                    />
                    <Tooltip title="Save">
                        <IconButton onClick={() => handleSaveClick(rowData)} size="small" color="primary">
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                        <IconButton onClick={handleCancelClick} size="small">
                            <CancelIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        }

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '48px' }}>
                <span>{field === 'price' ? `₹${rowData.price.toFixed(2)}` : rowData.quantity}</span>
                <Tooltip title={`Edit ${field}`}>
                    <IconButton onClick={() => handleEditClick(rowData, field)} size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    };

    const columns = [
        { title: 'Item Name', field: 'name', editable: 'never' },
        {
            title: 'Price',
            field: 'price',
            editable: 'never',
            render: rowData => renderEditableCell(rowData, 'price')
        },
        {
            title: 'Quantity',
            field: 'quantity',
            editable: 'never',
            render: rowData => renderEditableCell(rowData, 'quantity')
        },
    ];

    return (
        <>
            <MaterialTable
                title="My Items"
                tableRef={tableRef}
                columns={columns}
                data={query =>
                    new Promise((resolve, reject) => {
                        api.get('/items/supplier', {
                            params: {
                                pageNumber: query.page + 1,
                                pageSize: query.pageSize,
                                searchTerm: query.search
                            }
                        })
                        .then(result => {
                            resolve({
                                data: result.data.items,
                                page: query.page,
                                totalCount: result.data.totalCount
                            });
                        })
                        .catch(error => {
                            setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
                            reject(error);
                        });
                    })
                }
                options={{
                    actionsColumnIndex: -1,
                    search: true,
                    paging: true,
                    headerStyle: { backgroundColor: '#f5f5f5', fontWeight: 'bold' }
                }}
            />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SupplierDashboard;