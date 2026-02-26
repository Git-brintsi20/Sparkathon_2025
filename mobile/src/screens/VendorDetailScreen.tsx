import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { fetchVendorById } from '../services/vendorService';

export default function VendorDetailScreen({ route }: any) {
  const { id } = route.params;
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendorById(id)
      .then(setVendor)
      .catch(() => setError('Failed to load vendor'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', flex: 1 }}>{error}</Text>;
  if (!vendor) return <Text style={{ flex: 1 }}>Vendor not found</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{vendor.name}</Text>
      <Text>Email: {vendor.email}</Text>
      <Text>Status: {vendor.status}</Text>
      <Text>Category: {vendor.category}</Text>
      <Text>Compliance Score: {vendor.complianceScore}</Text>
      {/* Add more fields as needed */}
    </View>
  );
}
