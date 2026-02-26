import api from './api';

export async function fetchVendors() {
  const res = await api.get('/vendors');
  return res.data?.data?.data || [];
}

export async function fetchVendorById(id: string) {
  const res = await api.get(`/vendors/${id}`);
  return res.data;
}

export async function createVendor(vendor: any) {
  const res = await api.post('/vendors', vendor);
  return res.data;
}

export async function updateVendor(id: string, vendor: any) {
  const res = await api.put(`/vendors/${id}`, vendor);
  return res.data;
}

export async function deleteVendor(id: string) {
  const res = await api.delete(`/vendors/${id}`);
  return res.data;
}
