import '@mantine/core/styles.css';
import VRCorePage from './pages/VRCorePage.jsx';
import { BrowserRouter, Routes, Route } from "react-router";

import { MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './layouts/MainLayout.jsx';

createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path="/" element={<VRCorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </MantineProvider>
)
