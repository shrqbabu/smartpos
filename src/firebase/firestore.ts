// Firestore Database Services - CRUD operations for all collections
import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDoc, getDocs, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, increment, writeBatch,
  Timestamp, QueryConstraint
} from 'firebase/firestore';
import { db } from './config';

// ===== PRODUCTS =====
export const productsRef = () => collection(db, 'products');

export const addProduct = async (data: any) => {
  return addDoc(productsRef(), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
};

export const updateProduct = async (id: string, data: any) => {
  return updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteProduct = async (id: string) => {
  return deleteDoc(doc(db, 'products', id));
};

export const getProducts = async () => {
  const snap = await getDocs(query(productsRef(), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getProductByBarcode = async (barcode: string) => {
  const q = query(productsRef(), where('barcode', '==', barcode));
  const snap = await getDocs(q);
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() };
  return null;
};

export const subscribeToProducts = (callback: (data: any[]) => void) => {
  return onSnapshot(query(productsRef(), orderBy('name')), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ===== CATEGORIES =====
export const categoriesRef = () => collection(db, 'categories');

export const addCategory = async (data: any) => {
  return addDoc(categoriesRef(), { ...data, createdAt: serverTimestamp() });
};

export const updateCategory = async (id: string, data: any) => {
  return updateDoc(doc(db, 'categories', id), data);
};

export const deleteCategory = async (id: string) => {
  return deleteDoc(doc(db, 'categories', id));
};

export const getCategories = async () => {
  const snap = await getDocs(query(categoriesRef(), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToCategories = (callback: (data: any[]) => void) => {
  return onSnapshot(categoriesRef(), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ===== ORDERS =====
export const ordersRef = () => collection(db, 'orders');

export const createOrder = async (orderData: any) => {
  const batch = writeBatch(db);
  
  // Create order
  const orderRef = doc(ordersRef());
  batch.set(orderRef, {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  // Update stock for each item
  for (const item of orderData.items) {
    const productRef = doc(db, 'products', item.productId);
    batch.update(productRef, {
      stock: increment(-item.quantity),
      updatedAt: serverTimestamp()
    });
    
    // Add inventory history
    const invRef = doc(collection(db, 'inventory'));
    batch.set(invRef, {
      productId: item.productId,
      productName: item.name,
      type: 'sale',
      quantity: -item.quantity,
      orderId: orderRef.id,
      createdAt: serverTimestamp()
    });
  }
  
  await batch.commit();
  return orderRef.id;
};

export const getOrders = async (filters?: { startDate?: Date; endDate?: Date; limit?: number }) => {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (filters?.startDate) {
    constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.startDate)));
  }
  if (filters?.endDate) {
    constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.endDate)));
  }
  if (filters?.limit) {
    constraints.push(limit(filters.limit));
  }
  
  const snap = await getDocs(query(ordersRef(), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToOrders = (callback: (data: any[]) => void, limitCount = 50) => {
  return onSnapshot(
    query(ordersRef(), orderBy('createdAt', 'desc'), limit(limitCount)),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

export const getTodayOrders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snap = await getDocs(
    query(ordersRef(), where('createdAt', '>=', Timestamp.fromDate(today)), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ===== CUSTOMERS =====
export const customersRef = () => collection(db, 'customers');

export const addCustomer = async (data: any) => {
  return addDoc(customersRef(), { ...data, loyaltyPoints: 0, createdAt: serverTimestamp() });
};

export const updateCustomer = async (id: string, data: any) => {
  return updateDoc(doc(db, 'customers', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteCustomer = async (id: string) => {
  return deleteDoc(doc(db, 'customers', id));
};

export const getCustomers = async () => {
  const snap = await getDocs(query(customersRef(), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getCustomerByPhone = async (phone: string) => {
  const q = query(customersRef(), where('phone', '==', phone));
  const snap = await getDocs(q);
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() };
  return null;
};

export const subscribeToCustomers = (callback: (data: any[]) => void) => {
  return onSnapshot(query(customersRef(), orderBy('name')), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ===== EMPLOYEES =====
export const employeesRef = () => collection(db, 'employees');

export const addEmployee = async (data: any) => {
  return addDoc(employeesRef(), { ...data, createdAt: serverTimestamp() });
};

export const updateEmployee = async (id: string, data: any) => {
  return updateDoc(doc(db, 'employees', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteEmployee = async (id: string) => {
  return deleteDoc(doc(db, 'employees', id));
};

export const getEmployees = async () => {
  const snap = await getDocs(query(employeesRef(), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToEmployees = (callback: (data: any[]) => void) => {
  return onSnapshot(query(employeesRef(), orderBy('name')), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ===== INVENTORY =====
export const inventoryRef = () => collection(db, 'inventory');

export const addInventoryEntry = async (data: any) => {
  const batch = writeBatch(db);
  
  const invRef = doc(inventoryRef());
  batch.set(invRef, { ...data, createdAt: serverTimestamp() });
  
  // Update product stock
  if (data.productId && data.quantity) {
    const productRef = doc(db, 'products', data.productId);
    batch.update(productRef, {
      stock: increment(data.quantity),
      updatedAt: serverTimestamp()
    });
  }
  
  await batch.commit();
  return invRef.id;
};

export const getInventoryHistory = async (productId?: string) => {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(100)];
  if (productId) constraints.unshift(where('productId', '==', productId));
  const snap = await getDocs(query(inventoryRef(), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ===== SUPPLIERS =====
export const suppliersRef = () => collection(db, 'suppliers');

export const addSupplier = async (data: any) => {
  return addDoc(suppliersRef(), { ...data, createdAt: serverTimestamp() });
};

export const updateSupplier = async (id: string, data: any) => {
  return updateDoc(doc(db, 'suppliers', id), data);
};

export const deleteSupplier = async (id: string) => {
  return deleteDoc(doc(db, 'suppliers', id));
};

export const getSuppliers = async () => {
  const snap = await getDocs(query(suppliersRef(), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ===== SETTINGS =====
export const getSettings = async () => {
  const docSnap = await getDoc(doc(db, 'settings', 'main'));
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateSettings = async (data: any) => {
  return setDoc(doc(db, 'settings', 'main'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

// ===== ACTIVITY LOGS =====
export const logActivity = async (data: {
  userId: string;
  userName: string;
  action: string;
  details: string;
  type: 'sale' | 'product' | 'customer' | 'employee' | 'inventory' | 'auth' | 'settings';
}) => {
  return addDoc(collection(db, 'activity_logs'), { ...data, createdAt: serverTimestamp() });
};

export const getActivityLogs = async (limitCount = 50) => {
  const snap = await getDocs(
    query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'), limit(limitCount))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export { serverTimestamp, Timestamp, increment };
