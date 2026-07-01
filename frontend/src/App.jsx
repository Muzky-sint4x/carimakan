import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import BillPage from "./pages/BillPage";
import Checkout from "./pages/Checkout";


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<FoodDetail />} />
              <Route path="/keranjang" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/karcis/:id" element={<BillPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
