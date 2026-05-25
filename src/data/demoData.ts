// Demo data for SmartPOS - Used when Firebase is not configured
// This allows the app to work in demo mode without a real Firebase project

export const DEMO_USER = {
  uid: 'demo-admin-001',
  email: 'admin@smartpos.com',
  displayName: 'Admin User',
  role: 'admin' as const,
  isActive: true,
  createdAt: new Date().toISOString(),
  phone: '+91 98765 43210'
};

export const DEMO_CATEGORIES = [
  { id: 'cat-1', name: 'Beverages', color: '#3b82f6', icon: '☕', description: 'Hot and cold drinks' },
  { id: 'cat-2', name: 'Food', color: '#10b981', icon: '🍔', description: 'Food items and snacks' },
  { id: 'cat-3', name: 'Electronics', color: '#8b5cf6', icon: '📱', description: 'Electronic gadgets' },
  { id: 'cat-4', name: 'Clothing', color: '#f59e0b', icon: '👕', description: 'Apparel and accessories' },
  { id: 'cat-5', name: 'Groceries', color: '#ef4444', icon: '🛒', description: 'Daily essentials' },
  { id: 'cat-6', name: 'Pharmacy', color: '#06b6d4', icon: '💊', description: 'Medicine and health' },
];

export const DEMO_PRODUCTS = [
  { id: 'p-1', name: 'Cappuccino', price: 120, stock: 50, category: 'Beverages', categoryId: 'cat-1', barcode: '8901234567890', taxRate: 5, unit: 'cup', lowStockAlert: 10, status: 'active', image: '' },
  { id: 'p-2', name: 'Espresso', price: 80, stock: 45, category: 'Beverages', categoryId: 'cat-1', barcode: '8901234567891', taxRate: 5, unit: 'cup', lowStockAlert: 10, status: 'active', image: '' },
  { id: 'p-3', name: 'Cold Brew', price: 150, stock: 8, category: 'Beverages', categoryId: 'cat-1', barcode: '8901234567892', taxRate: 5, unit: 'glass', lowStockAlert: 10, status: 'active', image: '' },
  { id: 'p-4', name: 'Burger', price: 250, stock: 20, category: 'Food', categoryId: 'cat-2', barcode: '8901234567893', taxRate: 12, unit: 'piece', lowStockAlert: 5, status: 'active', image: '' },
  { id: 'p-5', name: 'Sandwich', price: 180, stock: 15, category: 'Food', categoryId: 'cat-2', barcode: '8901234567894', taxRate: 12, unit: 'piece', lowStockAlert: 5, status: 'active', image: '' },
  { id: 'p-6', name: 'Pizza Slice', price: 200, stock: 0, category: 'Food', categoryId: 'cat-2', barcode: '8901234567895', taxRate: 12, unit: 'piece', lowStockAlert: 5, status: 'active', image: '' },
  { id: 'p-7', name: 'USB Cable', price: 299, stock: 30, category: 'Electronics', categoryId: 'cat-3', barcode: '8901234567896', taxRate: 18, unit: 'piece', lowStockAlert: 5, status: 'active', image: '' },
  { id: 'p-8', name: 'Phone Case', price: 199, stock: 25, category: 'Electronics', categoryId: 'cat-3', barcode: '8901234567897', taxRate: 18, unit: 'piece', lowStockAlert: 5, status: 'active', image: '' },
  { id: 'p-9', name: 'T-Shirt', price: 399, stock: 40, category: 'Clothing', categoryId: 'cat-4', barcode: '8901234567898', taxRate: 5, unit: 'piece', lowStockAlert: 5, status: 'active', image: '' },
  { id: 'p-10', name: 'Jeans', price: 999, stock: 12, category: 'Clothing', categoryId: 'cat-4', barcode: '8901234567899', taxRate: 5, unit: 'piece', lowStockAlert: 3, status: 'active', image: '' },
  { id: 'p-11', name: 'Rice (1kg)', price: 60, stock: 100, category: 'Groceries', categoryId: 'cat-5', barcode: '8901234568000', taxRate: 0, unit: 'kg', lowStockAlert: 20, status: 'active', image: '' },
  { id: 'p-12', name: 'Cooking Oil', price: 150, stock: 50, category: 'Groceries', categoryId: 'cat-5', barcode: '8901234568001', taxRate: 5, unit: 'litre', lowStockAlert: 10, status: 'active', image: '' },
  { id: 'p-13', name: 'Paracetamol', price: 35, stock: 200, category: 'Pharmacy', categoryId: 'cat-6', barcode: '8901234568002', taxRate: 0, unit: 'strip', lowStockAlert: 30, status: 'active', image: '' },
  { id: 'p-14', name: 'Vitamin C', price: 120, stock: 4, category: 'Pharmacy', categoryId: 'cat-6', barcode: '8901234568003', taxRate: 0, unit: 'bottle', lowStockAlert: 10, status: 'active', image: '' },
  { id: 'p-15', name: 'Green Tea', price: 90, stock: 60, category: 'Beverages', categoryId: 'cat-1', barcode: '8901234568004', taxRate: 5, unit: 'cup', lowStockAlert: 10, status: 'active', image: '' },
];

export const DEMO_CUSTOMERS = [
  { id: 'c-1', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@email.com', address: '12 MG Road, Delhi', loyaltyPoints: 250, totalPurchases: 5200 },
  { id: 'c-2', name: 'Priya Patel', phone: '9876543211', email: 'priya@email.com', address: '45 Brigade Road, Mumbai', loyaltyPoints: 180, totalPurchases: 3800 },
  { id: 'c-3', name: 'Amit Kumar', phone: '9876543212', email: 'amit@email.com', address: '78 Anna Salai, Chennai', loyaltyPoints: 450, totalPurchases: 9200 },
  { id: 'c-4', name: 'Sunita Rao', phone: '9876543213', email: 'sunita@email.com', address: '23 Park Street, Kolkata', loyaltyPoints: 120, totalPurchases: 2400 },
  { id: 'c-5', name: 'Vikram Singh', phone: '9876543214', email: 'vikram@email.com', address: '56 Linking Road, Bangalore', loyaltyPoints: 320, totalPurchases: 6500 },
];

export const DEMO_EMPLOYEES = [
  { id: 'e-1', name: 'Ramesh Kumar', email: 'ramesh@smartpos.com', phone: '9876501001', role: 'cashier', salary: 25000, joinDate: '2023-01-15', status: 'active', totalSales: 125000 },
  { id: 'e-2', name: 'Deepa Nair', email: 'deepa@smartpos.com', phone: '9876501002', role: 'manager', salary: 40000, joinDate: '2022-08-01', status: 'active', totalSales: 285000 },
  { id: 'e-3', name: 'Arjun Mehta', email: 'arjun@smartpos.com', phone: '9876501003', role: 'cashier', salary: 22000, joinDate: '2023-06-10', status: 'active', totalSales: 98000 },
  { id: 'e-4', name: 'Kavita Joshi', email: 'kavita@smartpos.com', phone: '9876501004', role: 'cashier', salary: 22000, joinDate: '2024-01-20', status: 'inactive', totalSales: 45000 },
];

export const DEMO_SUPPLIERS = [
  { id: 's-1', name: 'Alpha Distributors', contact: 'Suresh Gupta', phone: '9000011111', email: 'alpha@supply.com', address: 'Wholesale Market, Delhi', categories: ['Beverages', 'Food'] },
  { id: 's-2', name: 'Tech World Supply', contact: 'Manish Agarwal', phone: '9000022222', email: 'techworld@supply.com', address: 'Electronics Zone, Noida', categories: ['Electronics'] },
  { id: 's-3', name: 'Fashion Hub', contact: 'Pooja Verma', phone: '9000033333', email: 'fashionhub@supply.com', address: 'Textile Market, Surat', categories: ['Clothing'] },
  { id: 's-4', name: 'Agro Fresh', contact: 'Manoj Yadav', phone: '9000044444', email: 'agrofresh@supply.com', address: 'APMC Market, Pune', categories: ['Groceries'] },
];

// Generate demo orders with realistic data
const generateDemoOrders = () => {
  const orders = [];
  const paymentMethods = ['cash', 'upi', 'card'];
  const statuses = ['completed', 'completed', 'completed', 'refunded'];
  
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 5));
    date.setHours(Math.floor(Math.random() * 12) + 8);
    
    const items = [];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = DEMO_PRODUCTS[Math.floor(Math.random() * DEMO_PRODUCTS.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      const discount = Math.random() > 0.7 ? 10 : 0;
      const itemTotal = product.price * qty * (1 - discount / 100);
      subtotal += itemTotal;
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        discount,
        taxRate: product.taxRate
      });
    }
    
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    const customer = Math.random() > 0.5 ? DEMO_CUSTOMERS[Math.floor(Math.random() * DEMO_CUSTOMERS.length)] : null;
    
    orders.push({
      id: `ORD-${String(1000 + i).padStart(5, '0')}`,
      orderId: `ORD-${String(1000 + i).padStart(5, '0')}`,
      items,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      customerId: customer?.id || null,
      customerName: customer?.name || 'Walk-in Customer',
      cashierId: DEMO_EMPLOYEES[Math.floor(Math.random() * 3)].id,
      cashierName: DEMO_EMPLOYEES[Math.floor(Math.random() * 3)].name,
      createdAt: { toDate: () => date },
      updatedAt: { toDate: () => date }
    });
  }
  
  return orders;
};

export const DEMO_ORDERS = generateDemoOrders();

// Generate weekly sales data for charts
export const getWeeklySalesData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    sales: Math.floor(Math.random() * 15000) + 5000,
    orders: Math.floor(Math.random() * 30) + 10
  }));
};

export const getMonthlySalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 200000) + 50000,
    expenses: Math.floor(Math.random() * 100000) + 30000,
    profit: Math.floor(Math.random() * 100000) + 20000
  }));
};

export const DEMO_SETTINGS = {
  storeName: 'SmartPOS Store',
  storeAddress: '123 Main Street, New Delhi - 110001',
  storePhone: '+91 98765 43210',
  storeEmail: 'info@smartpos.com',
  currency: '₹',
  currencyCode: 'INR',
  taxRate: 18,
  taxName: 'GST',
  receiptFooter: 'Thank you for your purchase! Visit again.',
  logo: '',
  timezone: 'Asia/Kolkata',
  language: 'en',
  lowStockThreshold: 10
};
