import { create } from 'zustand';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  myProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;

  setProducts: (products: Product[]) => void;
  setMyProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  myProducts: [],
  selectedProduct: null,
  isLoading: false,
  searchQuery: '',
  selectedCategory: null,

  setProducts: (products) => set({ products }),
  
  setMyProducts: (products) => set({ myProducts: products }),

  addProduct: (product) => set((state) => ({
    products: [product, ...state.products],
    myProducts: [product, ...state.myProducts],
  })),

  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
    myProducts: state.myProducts.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
    selectedProduct:
      state.selectedProduct?.id === id
        ? { ...state.selectedProduct, ...updates }
        : state.selectedProduct,
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
    myProducts: state.myProducts.filter((p) => p.id !== id),
    selectedProduct:
      state.selectedProduct?.id === id ? null : state.selectedProduct,
  })),

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    return products.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory && product.status === 'active';
    });
  },
}));
