// App-wide State Context for POS System
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_CUSTOMERS } from '../data/demoData';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  categoryId: string;
  barcode?: string;
  image?: string;
  description?: string;
  status: 'active' | 'inactive';
  taxRate: number;
  unit: string;
  lowStockAlert: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt?: any;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  totalPurchases?: number;
  createdAt?: any;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
  discount: number;
  image?: string;
  barcode?: string;
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  cart: CartItem[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  updateCartDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  cartTotal: number;
  cartTax: number;
  cartSubtotal: number;
  cartDiscount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('smartpos-theme') as 'light' | 'dark') || 'light';
  });

  // Load demo data (replace with Firebase subscriptions when configured)
  useEffect(() => {

  const fetchData = async () => {
    try {

      // PRODUCTS
      const productsSnapshot = await getDocs(collection(db, 'products'));

      if (!productsSnapshot.empty) {
        const firebaseProducts = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        setProducts(firebaseProducts);

      } else {
        setProducts(DEMO_PRODUCTS as Product[]);
      }

      // CATEGORIES
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));

      if (!categoriesSnapshot.empty) {
        const firebaseCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];

        setCategories(firebaseCategories);

      } else {
        setCategories(DEMO_CATEGORIES as Category[]);
      }

      // CUSTOMERS
      const customersSnapshot = await getDocs(collection(db, 'customers'));

      if (!customersSnapshot.empty) {
        const firebaseCustomers = customersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];

        setCustomers(firebaseCustomers);

      } else {
        setCustomers(DEMO_CUSTOMERS as Customer[]);
      }

    } catch (error) {

      console.error(error);

      // fallback
      setProducts(DEMO_PRODUCTS as Product[]);
      setCategories(DEMO_CATEGORIES as Category[]);
      setCustomers(DEMO_CUSTOMERS as Customer[]);
    }
  };

  fetchData();

}, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('smartpos-theme', theme);
  }, [theme]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        taxRate: product.taxRate || 0,
        discount: 0,
        image: product.image,
        barcode: product.barcode
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  }, []);

  const updateCartDiscount = useCallback((productId: string, discount: number) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, discount } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);
  const toggleTheme = useCallback(() => setTheme(p => p === 'light' ? 'dark' : 'light'), []);

  // Calculate cart totals
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const discountAmt = (itemTotal * item.discount) / 100;
    return sum + (itemTotal - discountAmt);
  }, 0);

  const cartTax = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const discountAmt = (itemTotal * item.discount) / 100;
    const afterDiscount = itemTotal - discountAmt;
    return sum + (afterDiscount * item.taxRate) / 100;
  }, 0);

  const cartDiscount = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity * item.discount) / 100;
  }, 0);

  const cartTotal = cartSubtotal + cartTax;

  return (
    <AppContext.Provider value={{
      products, categories, customers, cart, sidebarOpen, theme,
      addToCart, removeFromCart, updateCartQty, updateCartDiscount, clearCart,
      toggleSidebar, toggleTheme,
      cartTotal, cartTax, cartSubtotal, cartDiscount
    }}>
      {children}
    </AppContext.Provider>
  );
};
