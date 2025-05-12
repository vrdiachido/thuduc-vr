import '@mantine/core/styles.css';
import VRCorePage from './pages/VRCorePage';
import { BrowserRouter, Routes, Route } from "react-router";
import { MantineProvider, createTheme } from '@mantine/core';
import { createRoot } from 'react-dom/client'
import './index.css'
import ProtectedLayout from './layouts/ProtectedLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import CreateHotSpotPage from './pages/CreateHotSpotPage';
import LatLonPickerPage from './pages/LatLonPickerPage';


createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path="/" element={<VRCorePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="admin" element={<ProtectedLayout />}>
          <Route index path="/admin/create-hotspot" element={<CreateHotSpotPage />} />
          <Route path='/admin/lat-lon-picker' element={<LatLonPickerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </MantineProvider>
)
