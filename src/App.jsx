import SignUp from "./SignUp";
import EditProduct from "./Admin/EditProduct";
import ManageProduct from "./Admin/ManageProduct";
import AddProduct from "./Admin/AddProduct";
import AdminDashboard from "./Admin/AdminDashboard";
import ProductDetail from "./ProductDetail";
import { Routes, Route ,useLocation} from "react-router-dom";
import Navbar from "./navbar";
import Home from "./home";
import Login from "./login";
import Cart from "./cart";
import Checkout from "./Checkout";
import Footer from "./Footer";
import AdminLogin from "./Admin/AdminLogin";
import { ProductProvider } from "./contexts/ProductContext"; 
import ManageOrders from "./Admin/ManageOrders";

function App() {
  const location = useLocation();
  return (
    <ProductProvider>
      <div className="app">
        {location.pathname !== "/admin-login" &&
         location.pathname !== "/admin-dashboard" && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
<Route path="/admin-login" element={<AdminLogin />} /> 
  <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/manage-product" element={<ManageProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/manage-orders" element={<ManageOrders/>}/>
        </Routes>
        {location.pathname !== "/admin-login" &&
         location.pathname !== "/admin-dashboard" && <Footer />}
      </div>
    </ProductProvider>
  );
}

export default App;

