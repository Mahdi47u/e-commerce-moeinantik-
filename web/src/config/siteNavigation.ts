export type NavigationLink = {
  href: string;
  label: string;
};

export const mainNavigation: NavigationLink[] = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/pages/about", label: "درباره گالری" },
  { href: "/pages/contact", label: "تماس با ما" },
];

export const shopNavigation: NavigationLink[] = [
  { href: "/products", label: "همه محصولات" },
  { href: "/products?featured=true", label: "محصولات ویژه" },
  { href: "/products?sort=newest", label: "تازه ترین ها" },
  { href: "/wishlist", label: "علاقه مندی ها" },
  { href: "/cart", label: "سبد خرید" },
  { href: "/orders", label: "سفارش ها" },
];

export const contentNavigation: NavigationLink[] = [
  { href: "/pages/about", label: "درباره گالری" },
  { href: "/pages/contact", label: "تماس با ما" },
  { href: "/pages/shipping", label: "ارسال و پرداخت" },
  { href: "/pages/terms", label: "قوانین خرید" },
];

export const adminNavigation: NavigationLink[] = [
  { href: "/admin/orders", label: "مدیریت سفارش ها" },
];
