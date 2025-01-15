import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { dbManager } from './services/database/core';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  useEffect(() => {
    // Initialise toutes les bases de données au démarrage de l'application
    dbManager.initialize().catch(console.error);

    // Nettoie les connexions lors de la fermeture de l'application
    return () => {
      dbManager.closeAll().catch(console.error);
    };
  }, []);

  return (
    <Router>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;