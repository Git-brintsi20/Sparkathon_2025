import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import deliveryService, { Delivery } from '../services/deliveryService';

interface Props {
  navigation: any;
}

const statusColors: Record<string, string> = {
  pending: '#FFA500',
  in_transit: '#2196F3',
  delivered: '#4CAF50',
  verified: '#0071DC',
  flagged: '#F44336',
  rejected: '#F44336',
};

const DeliveryListScreen: React.FC<Props> = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    try {
      setError(null);
      const data = await deliveryService.fetchDeliveries();
      setDeliveries(data.deliveries || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const renderDelivery = ({ item }: { item: Delivery }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || '#999' }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.vendorName}>{item.vendorName || 'Unknown Vendor'}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.date}>
          {item.expectedDate ? new Date(item.expectedDate).toLocaleDateString() : 'No date'}
        </Text>
        <Text style={styles.items}>{item.items?.length || 0} items</Text>
        {item.fraudFlag && <Text style={styles.fraudBadge}>FRAUD FLAG</Text>}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0071DC" />
        <Text style={styles.loadingText}>Loading deliveries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDeliveries}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item._id}
        renderItem={renderDelivery}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No deliveries found</Text>
          </View>
        }
        contentContainerStyle={deliveries.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { color: '#F44336', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#0071DC', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#999', fontSize: 16 },
  emptyList: { flexGrow: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  vendorName: { fontSize: 14, color: '#666', marginTop: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  date: { fontSize: 12, color: '#999' },
  items: { fontSize: 12, color: '#999' },
  fraudBadge: { color: '#F44336', fontSize: 11, fontWeight: 'bold', backgroundColor: '#FFEBEE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});

export default DeliveryListScreen;
