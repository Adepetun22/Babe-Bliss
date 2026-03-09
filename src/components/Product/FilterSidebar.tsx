import { useState } from 'react';

// ==================== TYPES ====================

export interface FilterState {
  category: string;
  maxPrice: number;
  ages: Set<string>;
  brands: string[];
  ratings: number[];
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearAll: () => void;
}

// ==================== FILTER DATA ====================

const CATEGORIES = [
  { name: 'All', label: 'All Products', count: 986 },
  { name: 'Feeding', label: '🍼 Feeding', count: 124 },
  { name: 'Diapering', label: '🌿 Diapering', count: 87 },
  { name: 'Nursery', label: '🌙 Nursery', count: 210 },
  { name: 'Toys', label: '🧸 Toys', count: 195 },
  { name: 'Clothing', label: '👶 Clothing', count: 302 },
  { name: 'Gifts', label: '🎁 Gifts', count: 68 },
];

const BRANDS = [
  { id: 'b1', name: 'Lumi Originals', count: 312, checked: true },
  { id: 'b2', name: 'NatureBorn', count: 187, checked: false },
  { id: 'b3', name: 'TinyLeaf', count: 143, checked: false },
  { id: 'b4', name: 'Dreamland', count: 98, checked: false },
  { id: 'b5', name: 'SoftCloud', count: 76, checked: false },
];

const AGE_GROUPS = ['Newborn', '0–3 mo', '3–6 mo', '6–12 mo', '1–2 yr', '2–3 yr', '3+ yr'];

const RATINGS = [
  { id: 'r5', label: '★★★★★ 5 stars', value: 5 },
  { id: 'r4', label: '★★★★☆ 4+ stars', value: 4 },
  { id: 'r3', label: '★★★☆☆ 3+ stars', value: 3 },
];

// ==================== HELPER HOOK ====================

function useCollapsedSections(initialState: Record<string, boolean> = {}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(initialState);

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isCollapsed = (section: string) => collapsed[section] || false;

  return { collapsed, toggleSection, isCollapsed };
}

// ==================== SECTION COMPONENTS ====================

interface FilterSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isCollapsed, onToggle, children }: FilterSectionProps) {
  return (
    <div className="mb-9">
      <div 
        className="text-[11px] tracking-[0.22em] uppercase text-charcoal font-medium mb-[18px] flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        {title}
        <span className={`text-muted text-[16px] transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>↓</span>
      </div>
      <div className={`overflow-hidden transition-all duration-35 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function FilterSidebar({ filters, setFilters, onClearAll }: FilterSidebarProps) {
  const { toggleSection, isCollapsed } = useCollapsedSections();

  // Category handlers
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  // Price handlers
  const handlePriceChange = (value: number) => {
    setFilters(prev => ({ ...prev, maxPrice: value }));
  };

  // Brand handlers
  const handleBrandChange = (brandName: string, checked: boolean) => {
    setFilters(prev => {
      const newBrands = checked 
        ? [...prev.brands, brandName]
        : prev.brands.filter(b => b !== brandName);
      return { ...prev, brands: newBrands };
    });
  };

  // Age group handlers
  const handleAgeToggle = (age: string) => {
    setFilters(prev => {
      const newAges = new Set(prev.ages);
      if (newAges.has(age)) {
        newAges.delete(age);
      } else {
        newAges.add(age);
      }
      return { ...prev, ages: newAges };
    });
  };

  // Rating handlers
  const handleRatingChange = (ratingValue: number, checked: boolean) => {
    setFilters(prev => {
      const newRatings = checked 
        ? [...prev.ratings, ratingValue]
        : prev.ratings.filter(r => r !== ratingValue);
      return { ...prev, ratings: newRatings };
    });
  };

  return (
    <aside className="w-[268px] flex-shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto p-7 bg-warm-white border-r border-clay/14 scrollbar-thin scrollbar-thumb-clay-light scrollbar-track-transparent">
      {/* Category Section */}
      <FilterSection
        title="Category"
        isCollapsed={isCollapsed('category')}
        onToggle={() => toggleSection('category')}
      >
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`cat-pill flex items-center justify-between px-3.5 py-2.5 rounded-[10px] cursor-pointer text-[13px] transition-all border border-transparent ${
                filters.category === cat.name 
                  ? 'bg-clay text-white border-clay' 
                  : 'text-muted hover:bg-clay-light hover:text-clay'
              }`}
              onClick={() => handleCategoryChange(cat.name)}
            >
              <span>{cat.label}</span>
              <span className="text-[11px] opacity-70">{cat.count}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Section */}
      <FilterSection
        title="Price Range"
        isCollapsed={isCollapsed('price')}
        onToggle={() => toggleSection('price')}
      >
        <div className="flex justify-between text-[13px] text-clay font-medium mb-3.5">
          <span>$0</span>
          <span>${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-clay cursor-pointer"
        />
      </FilterSection>

      {/* Brand Section */}
      <FilterSection
        title="Brand"
        isCollapsed={isCollapsed('brand')}
        onToggle={() => toggleSection('brand')}
      >
        <div className="flex flex-col gap-2.5">
          {BRANDS.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                id={brand.id}
                checked={filters.brands.includes(brand.name) || (brand.checked && filters.brands.length === 0)}
                onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                className="w-4 h-4 accent-clay cursor-pointer rounded"
              />
              <label htmlFor={brand.id} className="text-[13px] text-muted cursor-pointer flex-1 hover:text-charcoal transition-colors">
                {brand.name}
              </label>
              <span className="text-[11px] text-muted">{brand.count}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Age Group Section */}
      <FilterSection
        title="Age Group"
        isCollapsed={isCollapsed('age')}
        onToggle={() => toggleSection('age')}
      >
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((age) => (
            <div
              key={age}
              className={`age-tag px-3.5 py-1.5 rounded-[20px] text-[12px] border border-clay/14 cursor-pointer transition-all whitespace-nowrap ${
                filters.ages.has(age) 
                  ? 'bg-clay border-clay text-white' 
                  : 'text-muted hover:border-clay hover:text-clay'
              }`}
              onClick={() => handleAgeToggle(age)}
            >
              {age}
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Rating Section */}
      <FilterSection
        title="Rating"
        isCollapsed={isCollapsed('rating')}
        onToggle={() => toggleSection('rating')}
      >
        <div className="flex flex-col gap-2.5">
          {RATINGS.map((rating) => (
            <div key={rating.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                id={rating.id}
                checked={filters.ratings.includes(rating.value)}
                onChange={(e) => handleRatingChange(rating.value, e.target.checked)}
                className="w-4 h-4 accent-clay cursor-pointer rounded"
              />
              <label htmlFor={rating.id} className="text-[13px] text-muted cursor-pointer">
                {rating.label}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Clear All Button */}
      <button 
        onClick={onClearAll}
        className="w-full py-[11px] border border-clay/14 rounded-[10px] bg-transparent text-muted text-[12px] tracking-[0.08em] uppercase cursor-pointer transition-all"
      >
        ✕ Clear All Filters
      </button>
    </aside>
  );
}

// Re-export types for external use
export type { FilterSidebarProps };

