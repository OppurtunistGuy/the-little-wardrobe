import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { catalogService } from '../services/catalogService';
import { brandConfig as defaultSettings } from '../config/brandConfig';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [publicProducts, setPublicProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const revalidate = useCallback(async () => {
    try {
      setError(null);
      const [pub, adm, sett] = await Promise.all([
        catalogService.fetchPublicProducts(),
        catalogService.fetchAdminProducts(),
        catalogService.fetchSettings(),
      ]);

      setPublicProducts(pub);
      setAdminProducts(adm);
      setSettings(sett);
    } catch (err) {
      console.error('[CatalogContext] Revalidation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  // Featured products: max 4 marked featured, or fallback to first 4 published
  const featuredProducts = publicProducts
    .filter((p) => p.featured)
    .slice(0, 4);

  const effectiveFeatured = featuredProducts.length > 0 
    ? featuredProducts 
    : publicProducts.slice(0, 4);

  // Mutation wrappers
  const saveProduct = async (productData) => {
    const saved = await catalogService.saveProduct(productData);
    await revalidate();
    return saved;
  };

  const archiveProduct = async (id) => {
    await catalogService.archiveProduct(id);
    await revalidate();
  };

  const restoreProduct = async (id) => {
    await catalogService.restoreProduct(id);
    await revalidate();
  };

  const permanentDeleteProduct = async (id) => {
    await catalogService.permanentDeleteProduct(id);
    await revalidate();
  };

  const duplicateProduct = async (id) => {
    const dup = await catalogService.duplicateProduct(id);
    await revalidate();
    return dup;
  };

  const updateSettings = async (newSettings) => {
    const updated = await catalogService.updateSettings(newSettings);
    await revalidate();
    return updated;
  };

  const value = {
    publicProducts,
    adminProducts,
    featuredProducts: effectiveFeatured,
    settings,
    loading,
    error,
    isUsingSupabase: catalogService.isUsingSupabase,
    revalidate,
    saveProduct,
    archiveProduct,
    restoreProduct,
    permanentDeleteProduct,
    duplicateProduct,
    updateSettings,
    uploadProductImage: catalogService.uploadProductImage,
    exportCatalogBackup: catalogService.exportCatalogBackup,
    validateAndImportBackup: catalogService.validateAndImportBackup,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
