import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchVendors } from '../services/vendorService';

export default function VendorListScreen({ navigation }: any) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendors()
      .then(setVendors)
      .catch(() => setError('Failed to load vendors'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', flex: 1 }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={vendors}
        keyExtractor={item => item._id || item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('VendorDetail', { id: item._id || item.id })}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.email}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
