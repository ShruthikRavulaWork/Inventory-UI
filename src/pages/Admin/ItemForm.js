import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Autocomplete, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';
import { getErrorMessage } from '../../utils/errorUtils';

const ItemForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [item, setItem] = useState({ name: '', price: '', quantity: '', supplierID: null });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        api.get('/items/suppliers')
            .then(res => {
                if (isMounted) setSuppliers(res.data);
            })
            .catch(err => {
                if (isMounted) setError(`Failed to fetch suppliers: ${getErrorMessage(err)}`);
            });

        if (isEditing) {
            setLoading(true);
            api.get(`/items/${id}`)
                .then(res => {
                    if (isMounted) {
                        setItem({ ...res.data, supplierID: res.data.supplierID });
                        if (res.data.imagePath) {
                            setImagePreview(`http://localhost:5268${res.data.imagePath}`);
                        }
                    }
                })
                .catch(err => {
                    if (isMounted) setError(`Failed to load item data: ${getErrorMessage(err)}`);
                })
                .finally(() => {
                    if (isMounted) setLoading(false);
                });
        }
        return () => { isMounted = false; };
    }, [id, isEditing]);

    const handleChange = (e) => setItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const handleSupplierChange = (event, newValue) => {
        setItem(prev => ({ ...prev, supplierID: newValue ? newValue.UserID : null }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'image/png') {
                setError('Only PNG images are allowed.');
                return;
            }
            setError('');
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!item.supplierID) {
            setError("Please select a supplier.");
            return;
        }
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('price', item.price);
        formData.append('quantity', item.quantity);
        formData.append('supplierID', item.supplierID);
        if (image) formData.append('image', image);

        try {
            if (isEditing) {
                await api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            } else {
                await api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            }
            navigate('/admin/dashboard');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>{isEditing ? 'Edit Item' : 'Create Item'}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                <TextField name="name" label="Item Name" value={item.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="price" label="Price" type="number" value={item.price} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="quantity" label="Quantity" type="number" value={item.quantity} onChange={handleChange} fullWidth margin="normal" required />
                <Autocomplete
                    options={suppliers}
                    getOptionLabel={(option) => option.Username || ""}
                    value={suppliers.find(s => s.UserID === item.supplierID) || null}
                    onChange={handleSupplierChange}
                    isOptionEqualToValue={(option, value) => option.UserID === value.UserID}
                    renderInput={(params) => <TextField {...params} label="Supplier" margin="normal" required />}
                />
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Upload PNG Image
                    <input type="file" hidden accept="image/png" onChange={handleImageChange} />
                </Button>
                {imagePreview && <Box mt={2}><img src={imagePreview} alt="Preview" height="100" /></Box>}
                
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, display: 'block' }}>
                    {isEditing ? 'Save Changes' : 'Create Item'}
                </Button>
            </Box>
        </Container>
    );
};

export default ItemForm;