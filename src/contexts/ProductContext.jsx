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

    // ✅ FIXED ADD TO CART
    case 'ADD_TO_CART': {
      const productId = action.payload._id || action.payload.id;

      const existing = state.cartItems.find(
        item => item.productId === productId
      );

      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            productId,
            product: action.payload,
            quantity: 1
          }
        ]
      };
    }

    // ✅ FIXED REMOVE
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.productId !== action.payload.productId
        )
      };

    // ✅ FIXED UPDATE
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems
          .map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter(item => item.quantity > 0)
      };

    // ✅ FIXED LOAD BACKEND CART
    case 'LOAD_CART_BACKEND':
      if (action.payload && action.payload.length > 0) {
        return {
          ...state,
          cartItems: action.payload.map(item => ({
            productId: item.productId,
            product: item.product,
            quantity: item.quantity
          }))
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

  // 🔹 LOAD PRODUCTS
  const refetchProducts = useCallback(async () => {
    try {
      const res = await fetch('https://backend-zehy.onrender.com/api/products');
      const backendProducts = await res.json();

      const allProducts = backendProducts.map(p => ({
        id: p._id || p.id,
        _id: p._id,
        name: p.name,
        title: p.name,
        price: Number(p.price),
        image: p.image,
        category: (p.category || '').toLowerCase()
      }));

      dispatch({ type: 'SET_ALL_PRODUCTS', payload: allProducts });
      dispatch({ type: 'LOAD_PRODUCTS', payload: { all: allProducts } });

    } catch (err) {
      console.error(err);
    }
  }, []);

  // 🔹 LOAD CATEGORY PRODUCTS
  const fetchProductsByCategory = useCallback(async (category) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const query = category === 'all' ? '' : `?category=${category}`;
      const res = await fetch(`https://backend-zehy.onrender.com/api/products${query}`);
      const data = await res.json();

      const products = data.map(p => ({
        id: p._id,
        _id: p._id,
        name: p.name,
        title: p.name,
        price: Number(p.price),
        image: p.image,
        category: (p.category || '').toLowerCase()
      }));

      dispatch({ type: 'SET_ALL_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category });

    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 🔹 INITIAL LOAD
  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  // 🔹 LOAD CART FROM BACKEND (FIXED)
  useEffect(() => {
    fetch('https://backend-zehy.onrender.com/api/cart')
      .then(res => res.json())
      .then(cart => {
        if (cart.products && cart.products.length > 0) {
          dispatch({
            type: 'LOAD_CART_BACKEND',
            payload: cart.products
          });
        }
      })
      .catch(() => console.log('No backend cart'));
  }, []);

  // 🔹 SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('amazonCart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const value = {
    state,
    dispatch,
    productsState: state.productsState,
    allProducts: state.allProducts,
    currentCategory: state.currentCategory,
    loading: state.loading,
    cartItems: state.cartItems,
    refetchProducts,
    fetchProductsByCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}