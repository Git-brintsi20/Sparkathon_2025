import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import deliveryService, { Delivery } from '../services/deliveryService';

interface Props {
  route: { params: { deliveryId: string } };
  navigation: any;
}

const DeliveryDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await deliveryService.fetchDeliveryById(deliveryId);
        setDelivery(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load delivery');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [deliveryId]);

  const handleVerify = async () => {
    try {
      await deliveryService.verifyDelivery(deliveryId, {
        qrCodeScanned: true,
        quantityVerified: true,
        qualityVerified: true,
      });
      Alert.alert('Success', 'Delivery verified successfully');
      // Reload
      const data = await deliveryService.fetchDeliveryById(deliveryId);
      setDelivery(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Verification failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0071DC" />
      </View>
    );
  }

  if (error || !delivery) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Delivery not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Info</Text>
        <Row label="Order ID" value={delivery.orderId} />
        <Row label="Status" value={delivery.status} />
        <Row label="Verification" value={delivery.verificationStatus} />
        {delivery.expectedDate && (
          <Row label="Expected" value={new Date(delivery.expectedDate).toLocaleString()} />
        )}
        {delivery.deliveryDate && (
          <Row label="Delivered" value={new Date(delivery.deliveryDate).toLocaleString()} />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items ({delivery.items?.length || 0})</Text>
        {delivery.items?.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>
              Qty: {item.quantity} x ${item.unitPrice?.toFixed(2) || '0.00'}
            </Text>
          </View>
        ))}
      </View>

      {delivery.notes && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{delivery.notes}</Text>
        </View>
      )}

      {delivery.fraudFlag && (
        <View style={[styles.card, styles.fraudCard]}>
          <Text style={styles.fraudTitle}>Fraud Flag</Text>
          <Text style={styles.fraudText}>This delivery has been flagged for review.</Text>
        </View>
      )}

      {delivery.status !== 'verified' && (
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify Delivery</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#F44336', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: '#666', fontSize: 14 },
  rowValue: { color: '#333', fontSize: 14, fontWeight: '500', textTransform: 'capitalize' },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: { fontSize: 14, color: '#333', flex: 1 },
  itemQty: { fontSize: 14, color: '#666' },
  notes: { color: '#555', fontSize: 14, lineHeight: 20 },
  fraudCard: { backgroundColor: '#FFF3F3', borderColor: '#F44336', borderWidth: 1 },
  fraudTitle: { color: '#F44336', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  fraudText: { color: '#D32F2F', fontSize: 14 },
  verifyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16,
  },
  verifyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default DeliveryDetailScreen;
