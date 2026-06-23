export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  /** Resolved from categories API at runtime */
  image?: string;
  imageSlug?: string;
  links: MegaMenuLink[];
}

export interface MegaMenuPromo {
  title: string;
  description?: string;
  image?: string;
  imageSlug?: string;
  href: string;
  cta?: string;
}

export type MegaMenuLayout = 'columns' | 'editorial';

export interface NavItem {
  label: string;
  href: string;
  megaLayout: MegaMenuLayout;
  columns: MegaMenuColumn[];
  promos?: MegaMenuPromo[];
}

export const navItems: NavItem[] = [
  {
    label: 'Collections',
    href: '/collections',
    megaLayout: 'editorial',
    columns: [
      {
        heading: 'Featured',
        links: [
          { label: 'All New', href: '/collections/new-arrivals' },
          { label: 'New This Week', href: '/collections/new-arrivals' },
          { label: 'Staff Picks', href: '/collections/featured' },
          { label: 'Summer Edit', href: '/collections/cotton-suits' },
        ],
      },
      {
        heading: 'Shop by Category',
        links: [
          { label: 'New Suit Sets', href: '/collections/cotton-suits' },
          { label: 'Kurta Sets', href: '/collections/kurta-sets' },
          { label: 'Party Wear', href: '/collections/party-wear' },
          { label: 'Dupattas', href: '/collections/dupattas' },
          { label: 'Silk Collection', href: '/collections/premium-collection' },
        ],
      },
      {
        heading: 'Shop by Occasion',
        links: [
          { label: 'Everyday Essentials', href: '/collections/everyday-wear' },
          { label: 'Office Wear', href: '/collections/office-wear' },
          { label: 'Weekend', href: '/collections/everyday-wear' },
          { label: 'Festive Ready', href: '/collections/festive' },
          { label: 'Wedding Dressing', href: '/collections/wedding' },
        ],
      },
      {
        heading: 'Collections',
        links: [
          { label: 'The Cotton Edit', href: '/collections/cotton-suits' },
          { label: 'Printed Staples', href: '/collections/printed-suits' },
          { label: 'Designer Suits', href: '/collections/designer-suits' },
          { label: 'Premium Collection', href: '/collections/premium-collection' },
          { label: 'Best Sellers', href: '/collections/best-sellers' },
        ],
      },
    ],
    promos: [
      {
        title: 'Cotton Favorites',
        description: 'Breathable, relaxed pieces for everyday wear.',
        imageSlug: 'cotton-suits',
        href: '/collections/cotton-suits',
      },
      {
        title: 'New This Week',
        description: 'Fresh arrivals handpicked for you.',
        imageSlug: 'party-wear',
        href: '/collections/new-arrivals',
        cta: 'Shop New Arrivals',
      },
    ],
  },
  {
    label: 'Shop',
    href: '/shop',
    megaLayout: 'columns',
    columns: [
      {
        heading: 'Cotton Suits',
        imageSlug: 'cotton-suits',
        links: [
          { label: 'Everyday Cotton', href: '/collections/cotton-suits' },
          { label: 'Printed Suits', href: '/collections/printed-suits' },
          { label: 'Office Cotton', href: '/collections/office-wear' },
        ],
      },
      {
        heading: 'Kurta Sets',
        imageSlug: 'kurta-sets',
        links: [
          { label: 'Casual Kurtas', href: '/collections/kurta-sets' },
          { label: 'Palazzo Sets', href: '/collections/kurta-sets' },
          { label: 'Co-ord Sets', href: '/collections/combo-sets' },
        ],
      },
      {
        heading: 'Party Wear',
        imageSlug: 'party-wear',
        links: [
          { label: 'Evening Suits', href: '/collections/party-wear' },
          { label: 'Designer Picks', href: '/collections/designer-suits' },
          { label: 'Embroidered', href: '/collections/party-wear' },
        ],
      },
      {
        heading: 'Festive',
        imageSlug: 'festive',
        links: [
          { label: 'Festive Suits', href: '/collections/festive' },
          { label: 'Silk Collection', href: '/collections/premium-collection' },
          { label: 'Wedding Edit', href: '/collections/wedding' },
        ],
      },
      {
        heading: 'Dupattas',
        imageSlug: 'dupattas',
        links: [
          { label: 'Silk Dupattas', href: '/collections/dupattas' },
          { label: 'Printed Dupattas', href: '/collections/dupattas' },
          { label: 'Banarasi Weaves', href: '/collections/dupattas' },
          { label: 'Bridal Dupattas', href: '/collections/wedding' },
        ],
      },
    ],
  },
  {
    label: 'Occasions',
    href: '/occasions',
    megaLayout: 'editorial',
    columns: [
      {
        heading: 'Featured',
        links: [
          { label: 'Wedding Season', href: '/collections/wedding' },
          { label: 'Festive Edit', href: '/collections/festive' },
          { label: 'Party Nights', href: '/collections/party-wear' },
          { label: 'Bridal Circle', href: '/collections/wedding' },
        ],
      },
      {
        heading: 'Everyday',
        links: [
          { label: 'Casual Wear', href: '/collections/everyday-wear' },
          { label: 'Office Wear', href: '/collections/office-wear' },
          { label: 'Cotton Comfort', href: '/collections/cotton-suits' },
          { label: 'Everyday Wear', href: '/collections/everyday-wear' },
        ],
      },
      {
        heading: 'Celebrations',
        links: [
          { label: 'Festive', href: '/collections/festive' },
          { label: 'Wedding', href: '/collections/wedding' },
          { label: 'Party Wear', href: '/collections/party-wear' },
          { label: 'Designer Suits', href: '/collections/designer-suits' },
        ],
      },
      {
        heading: 'Shop All',
        links: [
          { label: 'All Occasions', href: '/occasions' },
          { label: 'New Arrivals', href: '/collections/new-arrivals' },
          { label: 'Best Sellers', href: '/collections/best-sellers' },
          { label: 'Premium', href: '/collections/premium-collection' },
        ],
      },
    ],
    promos: [
      {
        title: 'Wedding Collection',
        description: 'For the bride and her closest circle.',
        imageSlug: 'wedding',
        href: '/collections/wedding',
      },
      {
        title: 'Festive Splendour',
        description: 'Rich embroideries and jewel-toned silks.',
        imageSlug: 'festive',
        href: '/collections/festive',
        cta: 'Shop Festive',
      },
    ],
  },
  {
    label: 'Sale',
    href: '/sale',
    megaLayout: 'columns',
    columns: [
      {
        heading: 'All Sale',
        imageSlug: 'printed-suits',
        links: [
          { label: 'View All Deals', href: '/sale' },
          { label: 'Under ₹1499', href: '/sale' },
          { label: 'Under ₹999', href: '/sale' },
        ],
      },
      {
        heading: 'Cotton',
        imageSlug: 'cotton-suits',
        links: [
          { label: 'Cotton Suits', href: '/collections/cotton-suits' },
          { label: 'Printed Suits', href: '/collections/printed-suits' },
          { label: 'Kurta Sets', href: '/collections/kurta-sets' },
        ],
      },
      {
        heading: 'Festive Sale',
        imageSlug: 'festive',
        links: [
          { label: 'Festive Suits', href: '/collections/festive' },
          { label: 'Party Wear', href: '/collections/party-wear' },
          { label: 'Silk Deals', href: '/collections/premium-collection' },
        ],
      },
      {
        heading: 'Clearance',
        imageSlug: 'dupattas',
        links: [
          { label: 'Last Chance', href: '/sale' },
          { label: 'Dupattas', href: '/collections/dupattas' },
          { label: 'Accessories', href: '/collections/accessories' },
        ],
      },
    ],
  },
];
