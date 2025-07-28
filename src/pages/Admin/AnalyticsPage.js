import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import api from '../../api/axios';
import { getErrorMessage } from '../../utils/errorUtils';

const AnalyticsPage = () => {
  const [leastStockData, setLeastStockData] = useState([]);
  const [supplierStockData, setSupplierStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const leastStockRes = await api.get('/analytics/least-stock-items');
        const supplierStockRes = await api.get('/analytics/least-supplier-stock');

        setLeastStockData(leastStockRes.data.map(item => ({ id: item.name, label: item.name, value: item.quantity })));
        setSupplierStockData(supplierStockRes.data.map(item => ({ id: item.username, label: item.username, value: item.totalQuantity })));
        
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
      <Paper sx={{ height: '500px', p: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>Top 5 Items with Least Stock</Typography>
        <ResponsiveBar
          data={leastStockData}
          keys={['value']}
          indexBy="label"
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Item',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Quantity',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </Paper>

      <Paper sx={{ height: '500px', p: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>Top 5 Suppliers by Lowest Stock</Typography>
        <ResponsivePie
          data={supplierStockData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
      </Paper>
    </Box>
  );
};

export default AnalyticsPage;