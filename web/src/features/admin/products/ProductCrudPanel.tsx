"use client";

import { useMemo, useState } from "react";
import { createAdminProduct, deleteAdminProduct, getAdminProduct, updateAdminProduct } from "@/services/catalogService";
import type { Category, Product, ProductStatus } from "@/types/catalog";
import { ProductFullEditor } from "./ProductFullEditor";
import { ProductListTable } from "./ProductListTable";
import { productToForm, productFormToPayload } from "./productFormMapper";
import { emptyProductForm, type ProductEditorTarget, type ProductForm } from "./productTypes";

export type { ProductEditorTarget } from "./productTypes";

export function ProductCrudPanel({
  token,
  products,
  categories,
  onChanged,
  productEditor,
}: {
  token: string | null;
  products: Product[];
  categories: Category[];
  onChanged: () => Promise<void>;
  productEditor: ProductEditorTarget;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProductStatus>("ALL");
  const [saving, setSaving] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const statusMatches = statusFilter === "ALL" || product.status === statusFilter;
      const queryMatches =
        !normalized ||
        [product.name, product.sku, product.slug, product.categoryName].filter(Boolean).some((value) => value?.toLowerCase().includes(normalized));

      return statusMatches && queryMatches;
    });
  }, [products, query, statusFilter]);

  async function selectProduct(productId: number) {
    if (!token) return;

    setError("");
    setLoadingProduct(true);
    try {
      const product = await getAdminProduct(token, productId);
      setSelectedProduct(product);
      setForm(productToForm(product));
    } catch (error) {
      setError(error instanceof Error ? error.message : "?????? ????? ?????? ???.");
    } finally {
      setLoadingProduct(false);
    }
  }

  function startCreate() {
    setSelectedProduct(null);
    setForm(emptyProductForm);
    setError("");
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    try {
      const payload = productFormToPayload(form, selectedProduct);
      const saved = selectedProduct ? await updateAdminProduct(token, selectedProduct.id, payload) : await createAdminProduct(token, payload);
      setSelectedProduct(saved);
      setForm(productToForm(saved));
      await onChanged();
    } catch (error) {
      setError(error instanceof Error ? error.message : "????? ????? ?????? ???.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!token || !window.confirm(`????? ?${product.name}? ??? ????`)) return;

    setError("");
    try {
      await deleteAdminProduct(token, product.id);
      if (selectedProduct?.id === product.id) startCreate();
      await onChanged();
    } catch (error) {
      setError(error instanceof Error ? error.message : "??? ????? ?????? ???.");
    }
  }

  if (productEditor.mode !== "list") {
    return <ProductFullEditor token={token} categories={categories} onChanged={onChanged} target={productEditor} />;
  }

  return (
    <ProductListTable
      products={filteredProducts}
      query={query}
      statusFilter={statusFilter}
      setQuery={setQuery}
      setStatusFilter={setStatusFilter}
      removeProduct={removeProduct}
    />
  );
}
