import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const ProductContext = createContext();

const initialState = {
  productsState: {},
  allProducts: [],
  currentCategory: 'all',
  cartItems: [],
  loading: true
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_PRODUCTS':
      return { ...state, productsState: action.payload, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ALL_PRODUCTS':
      return { ...state, allProducts: action.payload };

    case 'SET_CURRENT_CATEGORY':
      return { ...state, currentCategory: action.payload };

    case 'ADD_PRODUCT':
      const category = action.payload.category;
      return {
        ...state,
        productsState: {
          ...state.productsState,
          [category]: [...(state.productsState[category] || []), action.payload]
        }
      };

    case 'DELETE_PRODUCT':
      const newStateProducts = JSON.parse(JSON.stringify(state.productsState));
      Object.keys(newStateProducts).forEach(cat => {
        newStateProducts[cat] = newStateProducts[cat].filter(
          p => p.id !== action.payload.id
        );
      });
      return { ...state, productsState: newStateProducts };

    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(
        item => item.product._id === action.payload._id
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = state.cartItems.map(item =>
          item.product._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...state.cartItems,
          { product: { ...action.payload }, quantity: 1 }
        ];
      }

      // Backend sync handled in ProductCard

      return { ...state, cartItems: updatedCart };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.product._id !== action.payload._id
        )
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'LOAD_CART_BACKEND':
      if (state.cartItems.length === 0 && action.payload && action.payload.length > 0) {
        console.log('Loading backend cart:', action.payload.length, 'items');
        return {
          ...state,
          cartItems: action.payload.map(item => ({
            product: item.product,
            quantity: item.quantity
          })).filter(item => item.product)
        };
      }
      return state;

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refetchProducts = useCallback(async () => {
    try {
      const res = await fetch('https://backend-zehy.onrender.com/api/products');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const backendProducts = await res.json();
      const allProducts = backendProducts.map(p => ({
        id: p._id || p.id,
        title: p.name,
        price: Number(p.price),
        formattedPrice: Number(p.price).toLocaleString('en-IN'),
        image: p.image,
        category: (p.category || '').toLowerCase(),
        rating: 4,
        discount: '',
        original: ''
      }));

      const grouped = {
        electronics: allProducts.filter(p => p.category === 'electronics'),
        beauty: allProducts.filter(p => p.category === 'beauty'),
        home: allProducts.filter(p => p.category === 'home'),
        fashion: allProducts.filter(p => p.category === 'fashion'),
      };

      dispatch({ type: 'LOAD_PRODUCTS', payload: grouped });
      dispatch({ type: 'SET_ALL_PRODUCTS', payload: allProducts });
    } catch (err) {
      console.error('Refetch failed:', err);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (category) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const query = category === 'all' ? '' : `?category=${category}`;
      const res = await fetch(`https://backend-zehy.onrender.com/api/products${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const backendProducts = await res.json();
      const products = backendProducts.map(p => ({
        id: p._id || p.id,
        title: p.name,
        price: Number(p.price),
        formattedPrice: Number(p.price).toLocaleString('en-IN'),
        image: p.image,
        category: (p.category || '').toLowerCase(),
        rating: 4,
        discount: '',
        original: ''
      }));

      dispatch({ type: 'SET_ALL_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category });
    } catch (err) {
      console.error('Fetch category failed:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  useEffect(() => {
    if (state.cartItems.length === 0) {
      fetch('https://backend-zehy.onrender.com/api/products')
        .then(res => res.json())
        .then(cart => {
          if (cart.length > 0) {
            dispatch({ type: 'LOAD_CART_BACKEND', payload: cart });
          }
        })
        .catch(err => console.log('No backend cart'));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('amazonCart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const value = {
    state,
    dispatch,
    refetchProducts,
    fetchProductsByCategory,
    productsState: state.productsState,
    allProducts: state.allProducts,
    currentCategory: state.currentCategory,
    loading: state.loading,
    setCurrentCategory: category => dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category }),
    cartItems: state.cartItems
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
