"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Boxes,
  ChevronDown,
  ClipboardList,
  Eye,
  FolderTree,
  Home,
  MessageSquareText,
  Newspaper,
  PackageCheck,
  PackageSearch,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  SearchCheck,
  Settings,
  ShoppingBag,
  TrendingUp,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { FieldRoot, SelectField, TextArea, TextInput } from "@/components/ui/field";
import { MetricCard } from "@/components/ui/metric-card";
import { StatePanel } from "@/components/ui/state-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/context/AuthContext";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  getAdminProduct,
  getAdminProducts,
  updateAdminProduct,
  type ProductPayload,
} from "@/services/catalogService";
import { getAdminOrders } from "@/services/orderService";
import type { Category, Product, ProductStatus } from "@/types/catalog";
import type { Role } from "@/types/auth";
import type { Order } from "@/types/order";

type DashboardData = {
  orders: Order[];
  products: Product[];
  categories: Category[];
};

export type AdminDashboardTab = "dashboard" | "orders" | "products" | "categories" | "comments" | "blog" | "settings" | "seo";

export type ProductEditorTarget = { mode: "list" } | { mode: "new" } | { mode: "edit"; productId: number };

type ProductForm = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  variantTitle: string;
  variantSku: string;
  price: number;
  compareAtPrice: string;
  stockQuantity: number;
};

const emptyProductForm: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
  variantTitle: "پیش فرض",
  variantSku: "",
  price: 0,
  compareAtPrice: "",
  stockQuantity: 0,
};

const revenueSeries = [42, 55, 50, 68, 63, 82, 73, 88];
const orderSeries = [28, 34, 31, 42, 39, 55, 48, 58];

const adminDashboardTabs: Array<{ id: AdminDashboardTab; href: string; label: string; icon: typeof Home }> = [
  { id: "dashboard", href: "/admin/dashboard", label: "داشبورد", icon: Home },
  { id: "orders", href: "/admin/dashboard/orders", label: "سفارش ها", icon: ClipboardList },
  { id: "products", href: "/admin/dashboard/products", label: "محصولات", icon: PackageSearch },
  { id: "categories", href: "/admin/dashboard/categories", label: "دسته بندی ها", icon: FolderTree },
  { id: "comments", href: "/admin/dashboard/comments", label: "دیدگاه ها", icon: MessageSquareText },
  { id: "blog", href: "/admin/dashboard/blog", label: "بلاگ", icon: Newspaper },
  { id: "settings", href: "/admin/dashboard/settings", label: "تنظیمات", icon: Settings },
  { id: "seo", href: "/admin/dashboard/seo", label: "سئو", icon: SearchCheck },
];

export default function AdminDashboardPageClient({
  initialTab = "dashboard",
  productEditor = { mode: "list" },
}: {
  initialTab?: AdminDashboardTab;
  productEditor?: ProductEditorTarget;
}) {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData>({ orders: [], products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const activeTab = initialTab;

  const canViewDashboard = hasAdminRole(user?.roles || []);
  const activeTabMeta = adminDashboardTabs.find((tab) => tab.id === activeTab) || adminDashboardTabs[0];

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || !canViewDashboard) {
      setLoading(false);
      return;
    }

    loadDashboard();
  }, [authLoading, token, canViewDashboard]);

  const metrics = useMemo(() => buildMetrics(data), [data]);

  async function loadDashboard() {
    if (!token) {
      return;
    }

    setError("");
    setRefreshing(true);
    try {
      const [orders, products, categories] = await Promise.all([getAdminOrders(token), getAdminProducts(token), getAdminCategories(token)]);
      setData({ orders, products, categories });
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت داده های داشبورد ناموفق بود.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary/45 p-3 sm:p-5 lg:p-8" dir="rtl">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1680px] overflow-hidden rounded-md border border-border bg-background shadow-[0_26px_70px_-48px_rgba(33,30,26,0.62)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-card p-4 lg:border-b-0 lg:border-l">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-3" aria-label="داشبورد مدیریت معین آنتیک">
              <img
                src={BRAND_LOGO_URL}
                alt="معین آنتیک"
                width={945}
                height={573}
                className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
                style={{ width: "auto", maxWidth: "136px" }}
              />
            </Link>
            <Button asChild variant="secondary" size="sm" className="lg:mt-5 lg:w-full">
              <Link href="/">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                فروشگاه
              </Link>
            </Button>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible" aria-label="منوی مدیریت">
            {adminDashboardTabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-right text-sm font-semibold transition lg:flex lg:w-full",
                    active ? "bg-primary text-primary-foreground shadow-[0_12px_26px_-20px_rgba(61,45,25,0.7)]" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">پنل مدیریت</p>
              <h1 className="mt-1 text-3xl font-semibold leading-tight text-foreground">{activeTabMeta.label}</h1>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <label className="hidden h-11 min-w-[280px] items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground md:flex xl:min-w-[420px]">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>جستجو در سفارش، محصول یا مشتری</span>
              </label>
              <ThemeToggle />
              <Button type="button" variant="secondary" size="icon" aria-label="به روزرسانی" onClick={loadDashboard} disabled={refreshing || loading || !canViewDashboard}>
                <RefreshCw className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
              </Button>
              <span className="hidden items-center gap-3 rounded-md bg-card px-3 py-2 sm:inline-flex">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/12 text-primary">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-right">
                  <span className="block text-sm font-semibold text-foreground">{user?.username || "Admin"}</span>
                  <span className="block text-xs text-muted-foreground">مدیر</span>
                </span>
              </span>
            </div>
          </header>

        {!authLoading && !canViewDashboard && <AccessDenied />}
        {loading && canViewDashboard && <DashboardSkeleton />}

        {error && (
          <p className="mb-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {!loading && canViewDashboard && (
          activeTab === "dashboard" ? (
            <DashboardOverview metrics={metrics} />
          ) : (
            <AdminTabPanel tab={activeTab} data={data} metrics={metrics} token={token} onChanged={loadDashboard} productEditor={productEditor} />
          )
        )}
        </main>
      </div>
    </div>
  );
}

function DashboardOverview({ metrics }: { metrics: ReturnType<typeof buildMetrics> }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="شاخص های کلیدی فروشگاه">
        <MetricCard
          label="فروش کل"
          value={formatPrice(metrics.revenue)}
          helper={`${formatNumber(metrics.paidOrders)} سفارش پرداخت شده`}
          icon={<WalletCards className="h-4 w-4" aria-hidden="true" />}
          className="bg-primary/10"
        />
        <MetricCard
          label="کل سفارش ها"
          value={formatNumber(metrics.orderCount)}
          helper={`${formatNumber(metrics.processingOrders)} سفارش در حال پردازش`}
          icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
          tone="neutral"
        />
        <MetricCard
          label="محصولات فعال"
          value={formatNumber(metrics.activeProducts)}
          helper={`${formatNumber(metrics.lowStockCount)} مورد کم موجودی`}
          icon={<PackageCheck className="h-4 w-4" aria-hidden="true" />}
          tone={metrics.lowStockCount > 0 ? "warning" : "success"}
        />
        <MetricCard
          label="دسته بندی ها"
          value={formatNumber(metrics.categoryCount)}
          helper={`${formatNumber(metrics.featuredProducts)} محصول ویژه`}
          icon={<Boxes className="h-4 w-4" aria-hidden="true" />}
          tone="premium"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <RevenuePanel revenue={metrics.revenue} orders={metrics.orderCount} averageOrder={metrics.averageOrder} />
        <MonthlyTargetPanel revenue={metrics.revenue} target={metrics.monthlyTarget} progress={metrics.monthlyProgress} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.2fr)_minmax(280px,0.75fr)]">
        <TopCategoriesPanel categories={metrics.topCategories} />
        <ConversionPanel orderCount={metrics.orderCount} productCount={metrics.productCount} />
        <TrafficPanel />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]">
        <RecentOrdersPanel orders={metrics.recentOrders} />
        <LowStockPanel items={metrics.lowStockItems} />
      </section>
    </div>
  );
}

function AdminTabPanel({
  tab,
  data,
  metrics,
  token,
  onChanged,
  productEditor,
}: {
  tab: Exclude<AdminDashboardTab, "dashboard">;
  data: DashboardData;
  metrics: ReturnType<typeof buildMetrics>;
  token: string | null;
  onChanged: () => Promise<void>;
  productEditor: ProductEditorTarget;
}) {
  if (tab === "orders") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="کل سفارش ها" value={formatNumber(metrics.orderCount)} helper="همه سفارش های ثبت شده" icon={<ClipboardList className="h-4 w-4" />} />
          <MetricCard label="در حال پردازش" value={formatNumber(metrics.processingOrders)} helper="نیازمند پیگیری" icon={<RefreshCw className="h-4 w-4" />} tone="warning" />
          <MetricCard label="فروش پرداخت شده" value={formatPrice(metrics.revenue)} helper={`${formatNumber(metrics.paidOrders)} سفارش`} icon={<WalletCards className="h-4 w-4" />} />
        </section>
        <RecentOrdersPanel orders={data.orders.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 10)} />
      </div>
    );
  }

  if (tab === "products") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="همه محصولات" value={formatNumber(metrics.productCount)} helper="کاتالوگ فعلی" icon={<PackageSearch className="h-4 w-4" />} />
          <MetricCard label="محصولات فعال" value={formatNumber(metrics.activeProducts)} helper="قابل نمایش در فروشگاه" icon={<PackageCheck className="h-4 w-4" />} tone="success" />
          <MetricCard label="کم موجودی" value={formatNumber(metrics.lowStockCount)} helper="نیازمند تامین" icon={<Boxes className="h-4 w-4" />} tone="warning" />
        </section>
        <ProductCrudPanel token={token} products={data.products} categories={data.categories} onChanged={onChanged} productEditor={productEditor} />
      </div>
    );
  }

  if (tab === "categories") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-2">
          <MetricCard label="دسته بندی ها" value={formatNumber(metrics.categoryCount)} helper="ساختار فعلی فروشگاه" icon={<FolderTree className="h-4 w-4" />} />
          <MetricCard label="محصولات دسته بندی شده" value={formatNumber(metrics.productCount)} helper="براساس کاتالوگ فعلی" icon={<Boxes className="h-4 w-4" />} />
        </section>
        <TopCategoriesPanel categories={metrics.topCategories} />
      </div>
    );
  }

  const planned: Record<typeof tab, { title: string; description: string; icon: typeof MessageSquareText }> = {
    comments: {
      title: "مدیریت دیدگاه ها",
      description: "این تب برای تایید دیدگاه، پاسخ مدیر، گزارش تخلف و حذف دیدگاه آماده می شود.",
      icon: MessageSquareText,
    },
    blog: {
      title: "مدیریت بلاگ",
      description: "این تب برای دسته های بلاگ، نوشته ها، وضعیت پیش نویس و انتشار آماده می شود.",
      icon: Newspaper,
    },
    settings: {
      title: "تنظیمات اپلیکیشن",
      description: "این تب برای تنظیمات عمومی فروشگاه، لوگو، تماس، ارسال و رفتارهای اپلیکیشن آماده می شود.",
      icon: Settings,
    },
    seo: {
      title: "کنترل سئو",
      description: "این تب برای تنظیمات متا، وضعیت صفحات، نقشه سایت و خطاهای سئو آماده می شود.",
      icon: SearchCheck,
    },
  };
  const item = planned[tab];
  const Icon = item.icon;

  return (
    <section className="rounded-md border border-border bg-card p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{item.description}</p>
      <p className="mt-5 text-xs text-muted-foreground">همین صفحه می ماند و فقط تب تغییر می کند.</p>
    </section>
  );
}

function ProductCrudPanel({
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

  const flatCategories = useMemo(() => flattenProductCategories(categories), [categories]);
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
      setError(error instanceof Error ? error.message : "دریافت محصول ناموفق بود.");
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
      setError(error instanceof Error ? error.message : "ذخیره محصول ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!token || !window.confirm(`محصول «${product.name}» حذف شود؟`)) return;

    setError("");
    try {
      await deleteAdminProduct(token, product.id);
      if (selectedProduct?.id === product.id) startCreate();
      await onChanged();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف محصول ناموفق بود.");
    }
  }

  if (productEditor.mode !== "list") {
    return <ProductFullEditor token={token} categories={categories} onChanged={onChanged} target={productEditor} />;
  }

  return <ProductListTable products={filteredProducts} query={query} statusFilter={statusFilter} setQuery={setQuery} setStatusFilter={setStatusFilter} removeProduct={removeProduct} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
      <section className="rounded-md border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">مدیریت محصولات</h2>
            <p className="mt-1 text-xs text-muted-foreground">{formatNumber(filteredProducts.length)} محصول نمایش داده می شود.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex h-10 min-w-56 items-center gap-2 rounded-md border border-border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو" className="w-full bg-transparent text-sm outline-none" />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | ProductStatus)} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none">
              <option value="ALL">همه</option>
              <option value="ACTIVE">فعال</option>
              <option value="DRAFT">پیش نویس</option>
              <option value="ARCHIVED">آرشیو</option>
            </select>
            <Button type="button" onClick={startCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              محصول جدید
            </Button>
          </div>
        </div>

        {error && (
          <p className="m-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <div className="overflow-hidden">
          {filteredProducts.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">محصولی پیدا نشد.</p>}
          {filteredProducts.map((product) => {
            const stock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

            return (
              <div key={product.id} className="grid gap-3 border-t border-border px-4 py-4 first:border-t-0 md:grid-cols-[1fr_auto] md:items-center">
                <button type="button" onClick={() => selectProduct(product.id)} className="min-w-0 text-right">
                  <span className="block truncate font-semibold text-foreground">{product.name}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {product.categoryName || "بدون دسته"}، {formatProductPrice(product)}
                  </span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={productStatusTone(product.status)}>{productStatusLabel(product.status)}</StatusBadge>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">{formatNumber(stock)} عدد</span>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/products/${product.slug}`} target="_blank">
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      مشاهده
                    </Link>
                  </Button>
                  <button type="button" onClick={() => selectProduct(product.id)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary" aria-label="ویرایش">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => removeProduct(product)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <form onSubmit={saveProduct} className="h-fit rounded-md border border-border bg-card p-5 xl:sticky xl:top-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{selectedProduct ? "ویرایش محصول" : "محصول جدید"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">اطلاعات اصلی، قیمت، موجودی و سئو را ذخیره کنید.</p>
          </div>
          {loadingProduct && <RefreshCw className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />}
        </div>

        <div className="grid gap-4">
          <FieldRoot label="نام محصول" required>
            <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </FieldRoot>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRoot label="اسلاگ">
              <TextInput dir="ltr" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            </FieldRoot>
            <FieldRoot label="کد کالا">
              <TextInput dir="ltr" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
            </FieldRoot>
          </div>
          <FieldRoot label="دسته بندی">
            <SelectField value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
              <option value="">بدون دسته بندی</option>
              {flatCategories.map(({ category, depth }) => (
                <option key={category.id} value={category.id}>
                  {"-".repeat(depth)} {category.name}
                </option>
              ))}
            </SelectField>
          </FieldRoot>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRoot label="وضعیت">
              <SelectField value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}>
                <option value="DRAFT">پیش نویس</option>
                <option value="ACTIVE">فعال</option>
                <option value="ARCHIVED">آرشیو</option>
              </SelectField>
            </FieldRoot>
            <FieldRoot label="ترتیب">
              <TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
            </FieldRoot>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
            محصول ویژه باشد
          </label>
          <FieldRoot label="توضیح کوتاه">
            <TextArea value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} />
          </FieldRoot>
          <div className="rounded-md border border-border bg-background p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">تنوع پیش فرض</p>
            <div className="grid gap-4">
              <FieldRoot label="عنوان تنوع">
                <TextInput value={form.variantTitle} onChange={(event) => setForm({ ...form, variantTitle: event.target.value })} />
              </FieldRoot>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRoot label="قیمت" required>
                  <TextInput type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
                </FieldRoot>
                <FieldRoot label="موجودی">
                  <TextInput type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: Number(event.target.value) })} />
                </FieldRoot>
              </div>
            </div>
          </div>
          <FieldRoot label="توضیح کامل">
            <TextArea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </FieldRoot>
          <FieldRoot label="عنوان سئو">
            <TextInput value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
          </FieldRoot>
          <FieldRoot label="توضیح سئو">
            <TextArea value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} />
          </FieldRoot>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            ذخیره محصول
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProductListTable({
  products,
  query,
  statusFilter,
  setQuery,
  setStatusFilter,
  removeProduct,
}: {
  products: Product[];
  query: string;
  statusFilter: "ALL" | ProductStatus;
  setQuery: (value: string) => void;
  setStatusFilter: (value: "ALL" | ProductStatus) => void;
  removeProduct: (product: Product) => void;
}) {
  return (
    <section className="rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">فهرست محصولات</h2>
          <p className="mt-1 text-xs text-muted-foreground">{formatNumber(products.length)} محصول نمایش داده می شود.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/dashboard/products/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              محصول جدید
            </Link>
          </Button>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | ProductStatus)} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none">
            <option value="ALL">همه</option>
            <option value="ACTIVE">فعال</option>
            <option value="DRAFT">پیش نویس</option>
            <option value="ARCHIVED">آرشیو</option>
          </select>
          <label className="flex h-10 min-w-56 items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>
      </div>

      <div className="hidden grid-cols-[48px_minmax(260px,1fr)_120px_130px_110px_160px] border-b border-border px-4 py-3 text-xs font-semibold text-muted-foreground xl:grid">
        <span />
        <span>نام</span>
        <span>وضعیت</span>
        <span>موجودی</span>
        <span>قیمت</span>
        <span className="text-left">عملیات</span>
      </div>

      <div className="divide-y divide-border">
        {products.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">محصولی پیدا نشد.</p>}
        {products.map((product) => {
          const primaryImage = product.galleryImages.find((image) => image.primaryImage) || product.galleryImages[0];
          const stock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

          return (
            <div key={product.id} className="grid gap-3 px-4 py-3 text-sm xl:grid-cols-[48px_minmax(260px,1fr)_120px_130px_110px_160px] xl:items-center">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-secondary text-xs text-muted-foreground">
                {primaryImage ? <img src={primaryImage.url} alt={primaryImage.altText || product.name} className="h-full w-full object-cover" /> : "تصویر"}
              </span>
              <span>
                <Link href={`/admin/dashboard/products/${product.id}`} className="font-semibold text-foreground hover:text-primary">
                  {product.name}
                </Link>
                <span className="mt-1 block text-xs text-muted-foreground">{product.categoryName || "بدون دسته"}، {product.sku || product.slug}</span>
              </span>
              <span><StatusBadge tone={productStatusTone(product.status)}>{productStatusLabel(product.status)}</StatusBadge></span>
              <span className="text-muted-foreground">{formatNumber(stock)} عدد</span>
              <span className="font-semibold text-primary moein-tabular">{formatProductPrice(product)}</span>
              <span className="flex flex-wrap justify-start gap-2 xl:justify-end">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/dashboard/products/${product.id}`}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    ویرایش
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    مشاهده
                  </Link>
                </Button>
                <button type="button" onClick={() => removeProduct(product)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProductFullEditor({
  token,
  categories,
  onChanged,
  target,
}: {
  token: string | null;
  categories: Category[];
  onChanged: () => Promise<void>;
  target: Exclude<ProductEditorTarget, { mode: "list" }>;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [loading, setLoading] = useState(target.mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const flatCategories = useMemo(() => flattenProductCategories(categories), [categories]);

  useEffect(() => {
    if (!token || target.mode !== "edit") {
      setProduct(null);
      setForm(emptyProductForm);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    getAdminProduct(token, target.productId)
      .then((nextProduct) => {
        setProduct(nextProduct);
        setForm(productToForm(nextProduct));
      })
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت محصول ناموفق بود."))
      .finally(() => setLoading(false));
  }, [token, target]);

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    try {
      const payload = productFormToPayload(form, product);
      const saved = product ? await updateAdminProduct(token, product.id, payload) : await createAdminProduct(token, payload);
      setProduct(saved);
      setForm(productToForm(saved));
      await onChanged();
      router.replace(`/admin/dashboard/products/${saved.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره محصول ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct() {
    if (!token || !product || !window.confirm(`محصول «${product.name}» حذف شود؟`)) return;

    setError("");
    try {
      await deleteAdminProduct(token, product.id);
      await onChanged();
      router.push("/admin/dashboard/products");
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف محصول ناموفق بود.");
    }
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-md bg-secondary" />;
  }

  return (
    <form onSubmit={saveProduct} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{product ? "ویرایش محصول" : "افزودن محصول جدید"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">اطلاعات کامل محصول، قیمت، موجودی، توضیحات، سئو و داده های اصلی فروشگاه.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard/products">بازگشت به فهرست</Link>
          </Button>
          {product && (
            <Button type="button" variant="destructive" onClick={removeProduct}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              حذف
            </Button>
          )}
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            ذخیره محصول
          </Button>
        </div>
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5 rounded-md border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-foreground">اطلاعات اصلی</h3>
          <FieldRoot label="نام محصول" required>
            <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </FieldRoot>
          <FieldRoot label="توضیح کوتاه">
            <TextArea value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} />
          </FieldRoot>
          <FieldRoot label="توضیحات کامل محصول">
            <TextArea className="min-h-52" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </FieldRoot>

          <div className="rounded-md border border-border bg-background p-4">
            <h3 className="text-base font-semibold text-foreground">تنظیمات محصول</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FieldRoot label="عنوان تنوع">
                <TextInput value={form.variantTitle} onChange={(event) => setForm({ ...form, variantTitle: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="کد تنوع">
                <TextInput dir="ltr" value={form.variantSku} onChange={(event) => setForm({ ...form, variantSku: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="قیمت" required>
                <TextInput type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
              </FieldRoot>
              <FieldRoot label="قیمت قبل">
                <TextInput type="number" value={form.compareAtPrice} onChange={(event) => setForm({ ...form, compareAtPrice: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="موجودی">
                <TextInput type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: Number(event.target.value) })} />
              </FieldRoot>
            </div>
          </div>

          <div className="rounded-md border border-border bg-background p-4">
            <h3 className="text-base font-semibold text-foreground">سئو</h3>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="عنوان سئو">
                <TextInput value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="توضیح سئو">
                <TextArea value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} />
              </FieldRoot>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-md border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">انتشار</h3>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="وضعیت">
                <SelectField value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}>
                  <option value="DRAFT">پیش نویس</option>
                  <option value="ACTIVE">فعال</option>
                  <option value="ARCHIVED">آرشیو</option>
                </SelectField>
              </FieldRoot>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                محصول ویژه باشد
              </label>
              <Button type="submit" loading={saving} className="w-full">
                <Save className="h-4 w-4" aria-hidden="true" />
                ذخیره
              </Button>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">دسته بندی و شناسه</h3>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="دسته بندی">
                <SelectField value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                  <option value="">بدون دسته بندی</option>
                  {flatCategories.map(({ category, depth }) => (
                    <option key={category.id} value={category.id}>
                      {"-".repeat(depth)} {category.name}
                    </option>
                  ))}
                </SelectField>
              </FieldRoot>
              <FieldRoot label="اسلاگ">
                <TextInput dir="ltr" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="کد کالا">
                <TextInput dir="ltr" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="ترتیب نمایش">
                <TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
              </FieldRoot>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">رسانه و ویژگی ها</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              گالری تصاویر و ویژگی های پیشرفته در مرحله بعد به همین صفحه اضافه می شود. هنگام ذخیره، تصاویر و ویژگی های فعلی محصول حفظ می شوند.
            </p>
          </section>
        </aside>
      </div>
    </form>
  );
}

function ProductAdminPreview({ products }: { products: Product[] }) {
  const visibleProducts = products.slice(0, 8);

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">محصولات اخیر</h2>
        <span className="text-xs text-muted-foreground">{formatNumber(products.length)} محصول</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-md border border-border">
        {visibleProducts.length === 0 && <p className="p-5 text-sm text-muted-foreground">هنوز محصولی برای نمایش وجود ندارد.</p>}
        {visibleProducts.map((product) => {
          const stock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

          return (
            <div key={product.id} className="grid gap-3 border-t border-border px-4 py-3 text-sm first:border-t-0 md:grid-cols-[1fr_140px_110px]">
              <span>
                <span className="block font-semibold text-foreground">{product.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{product.categoryName || "بدون دسته"}</span>
              </span>
              <span className="text-muted-foreground">{product.status}</span>
              <span className="font-semibold text-primary moein-tabular md:text-left">{formatNumber(stock)} عدد</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RevenuePanel({ revenue, orders, averageOrder }: { revenue: number; orders: number; averageOrder: number }) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">تحلیل فروش</h2>
          <p className="mt-1 text-sm text-muted-foreground">نمای فعلی با داده سفارش ها ساخته می شود؛ نمودار زمانی واقعی در فاز Analytics API اضافه می شود.</p>
        </div>
        <Button type="button" variant="secondary" size="sm">
          ۸ روز اخیر
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-5 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
        <MiniStat label="فروش ثبت شده" value={formatPrice(revenue)} />
        <MiniStat label="سفارش ها" value={formatNumber(orders)} />
        <MiniStat label="میانگین سفارش" value={formatPrice(averageOrder)} />
      </div>

      <div className="mt-6 h-64 rounded-md bg-secondary/35 p-4">
        <LineChart revenue={revenueSeries} orders={orderSeries} />
      </div>
    </section>
  );
}

function MonthlyTargetPanel({ revenue, target, progress }: { revenue: number; target: number; progress: number }) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">هدف ماهانه</h2>
          <p className="mt-1 text-sm text-muted-foreground">براساس فروش پرداخت شده فعلی.</p>
        </div>
        <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>

      <div className="mx-auto mt-7 grid h-44 w-44 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--primary)) 0 ${clampedProgress}%, hsl(var(--secondary)) ${clampedProgress}% 100%)` }}>
        <div className="grid h-32 w-32 place-items-center rounded-full bg-card text-center">
          <span className="text-3xl font-semibold text-foreground moein-tabular">{formatNumber(Math.round(clampedProgress))}%</span>
          <span className="text-xs text-muted-foreground">پیشرفت</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-md border border-border text-center text-sm">
        <div className="p-3">
          <p className="text-muted-foreground">هدف</p>
          <p className="mt-1 font-semibold text-foreground moein-tabular">{formatPrice(target)}</p>
        </div>
        <div className="border-r border-border p-3">
          <p className="text-muted-foreground">فروش</p>
          <p className="mt-1 font-semibold text-primary moein-tabular">{formatPrice(revenue)}</p>
        </div>
      </div>
    </section>
  );
}

function TopCategoriesPanel({ categories }: { categories: Array<{ name: string; count: number; share: number }> }) {
  const top = categories.slice(0, 4);
  const gradient =
    top.length > 0
      ? `conic-gradient(hsl(var(--primary)) 0 ${top[0]?.share || 0}%, hsl(var(--luxury-gold)) ${top[0]?.share || 0}% ${(top[0]?.share || 0) + (top[1]?.share || 0)}%, hsl(var(--accent)) ${(top[0]?.share || 0) + (top[1]?.share || 0)}% ${(top[0]?.share || 0) + (top[1]?.share || 0) + (top[2]?.share || 0)}%, hsl(var(--secondary)) ${(top[0]?.share || 0) + (top[1]?.share || 0) + (top[2]?.share || 0)}% 100%)`
      : "hsl(var(--secondary))";

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">دسته های برتر</h2>
        <span className="text-xs text-muted-foreground">براساس تعداد محصول</span>
      </div>

      <div className="mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full" style={{ background: gradient }}>
        <div className="grid h-24 w-24 place-items-center rounded-full bg-card text-center">
          <span className="text-xs text-muted-foreground">کل</span>
          <span className="font-semibold text-foreground moein-tabular">{formatNumber(top.reduce((sum, item) => sum + item.count, 0))}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {top.length === 0 && <p className="text-sm text-muted-foreground">بعد از ساخت دسته بندی و محصول، این بخش کامل می شود.</p>}
        {top.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className={index === 0 ? "h-2.5 w-2.5 rounded-sm bg-primary" : index === 1 ? "h-2.5 w-2.5 rounded-sm bg-luxury-gold" : index === 2 ? "h-2.5 w-2.5 rounded-sm bg-accent" : "h-2.5 w-2.5 rounded-sm bg-secondary"} />
              <span className="truncate text-muted-foreground">{item.name}</span>
            </span>
            <span className="font-semibold text-foreground moein-tabular">{formatNumber(item.count)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConversionPanel({ orderCount, productCount }: { orderCount: number; productCount: number }) {
  const views = Math.max(productCount * 140, orderCount * 22, 120);
  const carts = Math.max(orderCount * 3, Math.round(views * 0.18));
  const checkouts = Math.max(orderCount * 2, Math.round(carts * 0.58));
  const completed = Math.max(orderCount, Math.round(checkouts * 0.62));
  const steps = [
    { label: "بازدید محصول", value: views, helper: "+۹٪" },
    { label: "افزودن به سبد", value: carts, helper: "+۶٪" },
    { label: "شروع پرداخت", value: checkouts, helper: "+۴٪" },
    { label: "خرید کامل", value: completed, helper: "+۷٪" },
  ];
  const max = Math.max(...steps.map((step) => step.value));

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">نرخ تبدیل</h2>
          <p className="mt-1 text-sm text-muted-foreground">نسخه اولیه تخمینی است تا رویدادهای واقعی اضافه شوند.</p>
        </div>
        <Button type="button" variant="secondary" size="sm">
          این هفته
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-6 grid min-h-64 grid-cols-4 items-end gap-3 border-b border-border pb-4">
        {steps.map((step, index) => (
          <div key={step.label} className="flex h-full flex-col justify-end gap-3">
            <div
              className={index === 0 ? "rounded-t-md bg-primary/20" : index === 1 ? "rounded-t-md bg-primary/25" : index === 2 ? "rounded-t-md bg-primary/40" : "rounded-t-md bg-primary/70"}
              style={{ height: `${Math.max(18, (step.value / max) * 78)}%` }}
            />
            <div>
              <p className="text-lg font-semibold text-foreground moein-tabular">{formatNumber(step.value)}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.label}</p>
              <span className="mt-2 inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">{step.helper}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrafficPanel() {
  const sources = [
    { label: "مستقیم", value: 40 },
    { label: "جستجوی گوگل", value: 30 },
    { label: "شبکه های اجتماعی", value: 18 },
    { label: "ارجاع", value: 12 },
  ];

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">منابع ترافیک</h2>
        <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="mt-6 flex h-14 overflow-hidden rounded-md">
        {sources.map((source, index) => (
          <span
            key={source.label}
            className={index === 0 ? "bg-primary/70" : index === 1 ? "bg-primary/50" : index === 2 ? "bg-primary/25" : "bg-secondary"}
            style={{ width: `${source.value}%` }}
            title={`${source.label} ${source.value}%`}
          />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {sources.map((source) => (
          <div key={source.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{source.label}</span>
            <span className="font-semibold text-foreground moein-tabular">{formatNumber(source.value)}٪</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentOrdersPanel({ orders }: { orders: Order[] }) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">سفارش های اخیر</h2>
        <span className="text-xs text-muted-foreground">{formatNumber(orders.length)} سفارش</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-md border border-border">
        {orders.length === 0 && <p className="p-5 text-sm text-muted-foreground">هنوز سفارشی برای نمایش وجود ندارد.</p>}
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3 border-t border-border px-4 py-3 text-sm first:border-t-0 md:grid-cols-[1fr_120px_130px]">
            <span>
              <span className="block font-semibold text-foreground">{order.orderNumber}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{order.customerName}</span>
            </span>
            <span className="text-muted-foreground">{order.city}</span>
            <span className="font-semibold text-primary moein-tabular md:text-left">{formatPrice(order.total)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LowStockPanel({ items }: { items: Array<{ name: string; variant: string; stock: number }> }) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">هشدار موجودی</h2>
        <Boxes className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="mt-5 space-y-3">
        {items.length === 0 && <p className="text-sm leading-7 text-muted-foreground">فعلا محصول کم موجودی پیدا نشد.</p>}
        {items.map((item) => (
          <div key={`${item.name}-${item.variant}`} className="rounded-md border border-border bg-background p-3">
            <p className="text-sm font-semibold text-foreground">{item.name}</p>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{item.variant}</span>
              <span className="rounded-md bg-amber-500/10 px-2 py-1 font-semibold text-amber-700">{formatNumber(item.stock)} عدد</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LineChart({ revenue, orders }: { revenue: number[]; orders: number[] }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 640 220" role="img" aria-label="نمودار فروش و سفارش">
      {[35, 80, 125, 170].map((y) => (
        <line key={y} x1="24" x2="616" y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="5 8" />
      ))}
      <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={toPoints(revenue)} />
      <polyline fill="none" stroke="hsl(var(--luxury-gold))" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" strokeLinejoin="round" points={toPoints(orders)} />
      {revenue.map((value, index) => {
        const [x, y] = pointFor(value, index, revenue.length);
        return <circle key={`${value}-${index}`} cx={x} cy={y} r={index === 5 ? 6 : 3} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="3" />;
      })}
    </svg>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground moein-tabular">{value}</p>
    </div>
  );
}

function AccessDenied() {
  return (
    <StatePanel
      tone="permission"
      title="دسترسی مدیریت لازم است"
      description="برای دیدن داشبورد باید با حساب دارای نقش ADMIN یا SUPERADMIN وارد شوید."
      actionLabel="ورود به حساب"
      actionHref="/login"
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-md bg-secondary" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <div className="h-80 animate-pulse rounded-md bg-secondary" />
        <div className="h-80 animate-pulse rounded-md bg-secondary" />
      </div>
      <div className="h-64 animate-pulse rounded-md bg-secondary" />
    </div>
  );
}

function productToForm(product: Product): ProductForm {
  const variant = product.variants[0];

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    categoryId: product.categoryId ? String(product.categoryId) : "",
    status: product.status,
    featured: product.featured,
    sortOrder: product.sortOrder,
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    variantTitle: variant?.title || "پیش فرض",
    variantSku: variant?.sku || "",
    price: variant?.price || 0,
    compareAtPrice: variant?.compareAtPrice ? String(variant.compareAtPrice) : "",
    stockQuantity: variant?.stockQuantity || 0,
  };
}

function productFormToPayload(form: ProductForm, current: Product | null): ProductPayload {
  return {
    name: form.name,
    slug: form.slug.trim() || undefined,
    sku: form.sku.trim() || undefined,
    shortDescription: form.shortDescription.trim() || undefined,
    description: form.description.trim() || undefined,
    categoryId: form.categoryId ? Number(form.categoryId) : null,
    status: form.status,
    featured: form.featured,
    sortOrder: form.sortOrder,
    seoTitle: form.seoTitle.trim() || undefined,
    seoDescription: form.seoDescription.trim() || undefined,
    variants: [
      {
        title: form.variantTitle.trim() || "پیش فرض",
        sku: form.variantSku.trim() || null,
        price: form.price,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stockQuantity: form.stockQuantity,
        active: true,
        sortOrder: 0,
      },
    ],
    galleryImages: (current?.galleryImages || []).map((image) => ({
      mediaAssetId: image.mediaAssetId,
      altText: image.altText || null,
      primaryImage: image.primaryImage,
      sortOrder: image.sortOrder,
    })),
    attributes: (current?.attributes || [])
      .filter((attribute) => attribute.attributeId)
      .map((attribute) => ({
        attributeId: attribute.attributeId,
        attributeValueId: attribute.attributeValueId || null,
        valueText: attribute.valueText || null,
        valueNumber: attribute.valueNumber || null,
        valueBoolean: attribute.valueBoolean || null,
        sortOrder: attribute.sortOrder,
      })),
  };
}

function flattenProductCategories(categories: Category[], depth = 0): Array<{ category: Category; depth: number }> {
  return categories.flatMap((category) => [{ category, depth }, ...flattenProductCategories(category.children || [], depth + 1)]);
}

function productStatusTone(status: ProductStatus) {
  return status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "neutral";
}

function productStatusLabel(status: ProductStatus) {
  return status === "ACTIVE" ? "فعال" : status === "DRAFT" ? "پیش نویس" : "آرشیو";
}

function formatProductPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  if (!prices.length) return "بدون قیمت";
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} تا ${formatPrice(maxPrice)}`;
}

function buildMetrics({ orders, products, categories }: DashboardData) {
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const productCount = products.length;
  const activeProducts = products.filter((product) => product.status === "ACTIVE").length;
  const featuredProducts = products.filter((product) => product.featured).length;
  const allVariants = products.flatMap((product) => product.variants.map((variant) => ({ product, variant })));
  const lowStockItems = allVariants
    .filter(({ variant }) => variant.active && variant.stockQuantity <= 3)
    .sort((a, b) => a.variant.stockQuantity - b.variant.stockQuantity)
    .slice(0, 5)
    .map(({ product, variant }) => ({ name: product.name, variant: variant.title, stock: variant.stockQuantity }));
  const flatCategories = flattenCategories(categories);
  const categoryProductCounts = products.reduce<Record<string, number>>((acc, product) => {
    const name = product.categoryName || "بدون دسته";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const totalCategorized = Math.max(1, Object.values(categoryProductCounts).reduce((sum, count) => sum + count, 0));
  const topCategories = Object.entries(categoryProductCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count]) => ({ name, count, share: Math.round((count / totalCategorized) * 100) }));
  const monthlyTarget = Math.max(100_000_000, Math.ceil((revenue || 1) * 1.35));
  const monthlyProgress = revenue > 0 ? (revenue / monthlyTarget) * 100 : 0;

  return {
    revenue,
    paidOrders: paidOrders.length,
    orderCount: orders.length,
    processingOrders: orders.filter((order) => order.status === "PROCESSING").length,
    averageOrder: paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0,
    productCount,
    activeProducts,
    featuredProducts,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    categoryCount: flatCategories.length,
    topCategories,
    monthlyTarget,
    monthlyProgress,
    recentOrders: orders.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5),
  };
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children || [])]);
}

function toPoints(values: number[]) {
  return values.map((value, index) => pointFor(value, index, values.length).join(",")).join(" ");
}

function pointFor(value: number, index: number, length: number): [number, number] {
  const x = 34 + index * (572 / Math.max(1, length - 1));
  const y = 198 - value * 1.82;
  return [x, y];
}

function hasAdminRole(roles: Role[]) {
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
