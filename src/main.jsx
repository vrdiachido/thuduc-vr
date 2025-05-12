import '@mantine/core/styles.css';
import VRCorePage from './pages/VRCorePage.jsx';
import { BrowserRouter, Routes, Route } from "react-router";
import { MantineProvider, createTheme } from '@mantine/core';
import ProtectedLayout from './layouts/ProtectedLayout.jsx';

import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './layouts/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateHotSpotPage from './pages/CreateHotSpotPage.jsx';
import LatLonPickerPage from './pages/LatLonPickerPage.jsx';


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
        </Route>3
      </Routes>
    </BrowserRouter>
  </MantineProvider>
)
