import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ToastContainer } from '../components/common/Toast';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 selection:bg-primary selection:text-[#0B1120]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
      <ToastContainer />
      <Footer />
    </div>
  );
};
