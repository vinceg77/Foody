import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../components/dashboard/Dashboard';
import { FoodTable } from '../components/products/FoodTable';
import { AddProductForm } from '../components/products/AddProductForm';
import { ProductSearch } from '../components/products/ProductSearch';
import { ProductDetails } from '../components/products/ProductDetails';
import { StorageManagement } from '../components/storage/StorageManagement';
import { Settings } from '../components/settings/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/foods" element={<FoodTable />} />
      <Route path="/foods/add" element={<AddProductForm />} />
      <Route path="/foods/search" element={<ProductSearch standalone />} />
      <Route path="/foods/:barcode" element={<ProductDetails />} />
      <Route path="/storage" element={<StorageManagement />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};