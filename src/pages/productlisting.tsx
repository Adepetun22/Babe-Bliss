import { useState, useEffect, useRef } from 'react';
import FilterSidebar from '../components/Product/FilterSidebar';

// ==================== TYPES ====================

interface Product {
  id: number;
  name: string;
  cat: string;
  desc: string;
  emoji: string;
  bg: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeType: 'sale' | 'new' | 'hot' | null;
  variants: string[];
  age: string;
  brand: string;
}

interface FilterState {
  category: string;
  maxPrice: number;
  ages: Set<string>;
  brands: string[];
  ratings: number[];
}

// ==================== PRODUCT DATA ====================

const ALL_PRODUCTS: Product[] = [
  {id:1,name:'Bloom Glass Bottle',cat:'Feeding',desc:'Anti-colic design with flow-control nipple. Perfect from newborn.',emoji:'🍼',bg:'img-bg-1',price:28,oldPrice:null,rating:4.9,reviews:2841,badge:'Bestseller',badgeType:'sale',variants:['4oz','8oz'],age:'0–3 mo',brand:'Lumi Originals'},
  {id:2,name:'Cloud Organic Swaddle',cat:'Clothing',desc:'GOTS certified cotton blend. Keeps baby cozy and secure all night.',emoji:'🌿',bg:'img-bg-2',price:42,oldPrice:null,rating:4.8,reviews:1203,badge:'New',badgeType:'new',variants:['S/M','L/XL'],age:'0–3 mo',brand:'NatureBorn'},
  {id:3,name:'Luna Sound Machine',cat:'Nursery',desc:'30 soothing sounds, auto-shutoff timer, nightlight included.',emoji:'🌙',bg:'img-bg-3',price:54,oldPrice:68,rating:4.9,reviews:3102,badge:'Top Rated',badgeType:'hot',variants:['White','Sage','Blush'],age:'Newborn',brand:'Dreamland'},
  {id:4,name:'Honey Bear Plush Set',cat:'Toys',desc:'Hypoallergenic fill, embroidered eyes, machine washable.',emoji:'🧸',bg:'img-bg-4',price:36,oldPrice:45,rating:4.7,reviews:876,badge:null,badgeType:null,variants:['Small','Medium','Large'],age:'3–6 mo',brand:'TinyLeaf'},
  {id:5,name:'AquaFlow Tub',cat:'Nursery',desc:'Ergonomic baby bath with temperature indicator and non-slip base.',emoji:'🛁',bg:'img-bg-5',price:48,oldPrice:null,rating:4.8,reviews:654,badge:'New',badgeType:'new',variants:['Mint','Cream'],age:'Newborn',brand:'SoftCloud'},
  {id:6,name:'Petal Rattle Set',cat:'Toys',desc:'6-piece sensory rattle set with varied textures and gentle sounds.',emoji:'🌸',bg:'img-bg-6',price:22,oldPrice:null,rating:4.6,reviews:432,badge:null,badgeType:null,variants:['Pastel','Brights'],age:'3–6 mo',brand:'TinyLeaf'},
  {id:7,name:'SilkSoft Burp Cloths',cat:'Feeding',desc:'12-pack. Triple-layer absorbency, stays put on shoulder.',emoji:'🌀',bg:'img-bg-7',price:32,oldPrice:38,rating:4.9,reviews:1876,badge:'Bestseller',badgeType:'sale',variants:['12pk','6pk'],age:'Newborn',brand:'Lumi Originals'},
  {id:8,name:'Star Mobile Projector',cat:'Nursery',desc:'360° rotating projection, 8 music melodies, remote control.',emoji:'⭐',bg:'img-bg-8',price:72,oldPrice:89,rating:4.7,reviews:1243,badge:null,badgeType:null,variants:['White','Charcoal'],age:'0–3 mo',brand:'Dreamland'},
  {id:9,name:'EcoDry Bamboo Diapers',cat:'Diapering',desc:'Ultra-soft bamboo layer, zero chemicals, plant-based SAP core.',emoji:'🎋',bg:'img-bg-1',price:38,oldPrice:null,rating:4.8,reviews:2104,badge:'New',badgeType:'new',variants:['NB','S','M','L'],age:'Newborn',brand:'NatureBorn'},
  {id:10,name:'Milestone Card Set',cat:'Gifts',desc:'52 beautifully illustrated cards capturing every first moment.',emoji:'🎴',bg:'img-bg-2',price:18,oldPrice:null,rating:4.9,reviews:987,badge:null,badgeType:null,variants:['Classic','Minimal'],age:'Newborn',brand:'Lumi Originals'},
  {id:11,name:'Knit Onesie Bundle',cat:'Clothing',desc:'Organic merino knit. Expandable neckline, no-scratch seams.',emoji:'🧶',bg:'img-bg-3',price:58,oldPrice:72,rating:4.7,reviews:543,badge:'Sale',badgeType:'sale',variants:['0–3m','3–6m','6–12m'],age:'3–6 mo',brand:'TinyLeaf'},
  {id:12,name:'Blossom Bottle Warmer',cat:'Feeding',desc:'Heats evenly in 4 minutes. Compatible with all bottle shapes.',emoji:'🌡',bg:'img-bg-4',price:44,oldPrice:null,rating:4.6,reviews:765,badge:null,badgeType:null,variants:['Standard'],age:'0–3 mo',brand:'SoftCloud'},
  {id:13,name:'Forest Friends Play Mat',cat:'Toys',desc:'Reversible, non-toxic foam. 78" × 59", with activity arches.',emoji:'🌲',bg:'img-bg-5',price:96,oldPrice:120,rating:4.9,reviews:1567,badge:'Bestseller',badgeType:'sale',variants:['Forest','Ocean','Desert'],age:'Newborn',brand:'NatureBorn'},
  {id:14,name:'Diaper Backpack Pro',cat:'Diapering',desc:'30 pockets, stroller straps, insulated bottle pocket, waterproof.',emoji:'🎒',bg:'img-bg-6',price:84,oldPrice:null,rating:4.8,reviews:1098,badge:'New',badgeType:'new',variants:['Sage','Clay','Charcoal'],age:'Newborn',brand:'Lumi Originals'},
  {id:15,name:'Sleep Sack Fleece',cat:'Clothing',desc:'TOG 2.5, 2-way zip, 100% fleece. Keeps legs free to develop.',emoji:'💤',bg:'img-bg-7',price:52,oldPrice:65,rating:4.8,reviews:2300,badge:null,badgeType:null,variants:['S','M','L'],age:'6–12 mo',brand:'Dreamland'},
  {id:16,name:'Gift Box — New Baby',cat:'Gifts',desc:'Curated set of 8 bestsellers beautifully wrapped and ribboned.',emoji:'🎁',bg:'img-bg-8',price:128,oldPrice:148,rating:5.0,reviews:412,badge:'Top Rated',badgeType:'hot',variants:['Classic','Luxury'],age:'Newborn',brand:'Lumi Originals'},
  {id:17,name:'Teething Cactus Toy',cat:'Toys',desc:'BPA-free silicone, 7 textures, dishwasher safe, easy to grip.',emoji:'🌵',bg:'img-bg-1',price:14,oldPrice:null,rating:4.7,reviews:1876,badge:null,badgeType:null,variants:['Sage','Blush','Yellow'],age:'3–6 mo',brand:'TinyLeaf'},
  {id:18,name:'Ceramide Baby Lotion',cat:'Diapering',desc:'Fragrance-free, hypoallergenic. Dermatologist tested for eczema.',emoji:'🧴',bg:'img-bg-2',price:19,oldPrice:null,rating:4.9,reviews:3204,badge:'Bestseller',badgeType:'sale',variants:['200ml','400ml'],age:'Newborn',brand:'NatureBorn'},
  {id:19,name:'Arch Activity Gym',cat:'Toys',desc:'10 hanging toys, tummy time pillow, foldable for travel.',emoji:'🦋',bg:'img-bg-3',price:78,oldPrice:95,rating:4.8,reviews:987,badge:'New',badgeType:'new',variants:['Rainbow','Neutral'],age:'Newborn',brand:'SoftCloud'},
  {id:20,name:'Memory Book — Year 1',cat:'Gifts',desc:'60-page linen-cover keepsake with guided prompts and pockets.',emoji:'📖',bg:'img-bg-4',price:46,oldPrice:null,rating:4.9,reviews:1654,badge:null,badgeType:null,variants:['Blush','Sage','Cream'],age:'Newborn',brand:'Lumi Originals'},
  {id:21,name:'Organic Crib Sheet Set',cat:'Nursery',desc:'Set of 3. OEKO-TEX, 300-thread count sateen. Deep pockets.',emoji:'🛏',bg:'img-bg-5',price:62,oldPrice:78,rating:4.8,reviews:1102,badge:'Sale',badgeType:'sale',variants:['White','Blush','Sage'],age:'Newborn',brand:'Dreamland'},
  {id:22,name:'Stacking Rings Classic',cat:'Toys',desc:'7 oversized rings, non-toxic wood, food-grade paint. Size-sorting.',emoji:'🏅',bg:'img-bg-6',price:26,oldPrice:null,rating:4.7,reviews:654,badge:null,badgeType:null,variants:['Natural','Pastel'],age:'6–12 mo',brand:'TinyLeaf'},
  {id:23,name:'Nesting Cups Set',cat:'Toys',desc:'10-pc. stackable, float in bath. Fine motor skill development.',emoji:'🥤',bg:'img-bg-7',price:18,oldPrice:null,rating:4.6,reviews:543,badge:null,badgeType:null,variants:['Rainbow','Pastel'],age:'6–12 mo',brand:'SoftCloud'},
  {id:24,name:'Wearable Baby Monitor',cat:'Nursery',desc:'Sock-style pulse ox & temp tracker. HD app with sleep insights.',emoji:'📡',bg:'img-bg-8',price:198,oldPrice:229,rating:4.8,reviews:2876,badge:'Top Rated',badgeType:'hot',variants:['Size 1 (0–18m)','Size 2 (18m+)'],age:'Newborn',brand:'NatureBorn'},
  {id:25,name:'Bamboo Changing Mat',cat:'Diapering',desc:'Waterproof bamboo cover, memory foam, machine washable.',emoji:'🌿',bg:'img-bg-1',price:34,oldPrice:null,rating:4.7,reviews:876,badge:null,badgeType:null,variants:['Natural','Cream'],age:'Newborn',brand:'NatureBorn'},
  {id:26,name:'Lovey Security Blanket',cat:'Clothing',desc:'Silky front, minky back. Personalization option available.',emoji:'💛',bg:'img-bg-2',price:28,oldPrice:null,rating:4.9,reviews:1432,badge:'Bestseller',badgeType:'sale',variants:['Bear','Bunny','Elephant'],age:'Newborn',brand:'TinyLeaf'},
  {id:27,name:'Wooden Block Set 30pc',cat:'Toys',desc:'FSC-certified, sanded smooth, solid natural pigment dyes.',emoji:'🟫',bg:'img-bg-3',price:54,oldPrice:68,rating:4.8,reviews:765,badge:'Sale',badgeType:'sale',variants:['Natural','Painted'],age:'1–2 yr',brand:'TinyLeaf'},
  {id:28,name:'Feeding Pillow Deluxe',cat:'Feeding',desc:'C-shaped support with removable cover. Fits all nursing positions.',emoji:'🤱',bg:'img-bg-4',price:68,oldPrice:null,rating:4.9,reviews:2109,badge:'New',badgeType:'new',variants:['Sage','Blush','Cream'],age:'Newborn',brand:'SoftCloud'},
  {id:29,name:'Room Temp Nightlight',cat:'Nursery',desc:'Dual sensor, warm amber glow, auto-off after 15 min.',emoji:'🌡',bg:'img-bg-5',price:38,oldPrice:null,rating:4.6,reviews:543,badge:null,badgeType:null,variants:['White','Walnut'],age:'Newborn',brand:'Dreamland'},
  {id:30,name:'Milestone Blanket',cat:'Gifts',desc:'Stretchy knit with month markers. Great for monthly photos.',emoji:'📸',bg:'img-bg-6',price:42,oldPrice:52,rating:4.8,reviews:987,badge:null,badgeType:null,variants:['Cream','Sage','Blush'],age:'Newborn',brand:'Lumi Originals'},
  {id:31,name:'First Foods Weaning Set',cat:'Feeding',desc:'Suction bowl, 2 spoons, straw cup, snack pot. All silicone.',emoji:'🥣',bg:'img-bg-7',price:46,oldPrice:58,rating:4.9,reviews:1765,badge:'Bestseller',badgeType:'sale',variants:['Sage','Blush','Yellow'],age:'6–12 mo',brand:'Lumi Originals'},
  {id:32,name:'Sensory Bin Starter',cat:'Toys',desc:'Kinetic sand, moulds, tools and storage tray in one box.',emoji:'🏖',bg:'img-bg-8',price:32,oldPrice:null,rating:4.5,reviews:432,badge:'New',badgeType:'new',variants:['Standard'],age:'2–3 yr',brand:'SoftCloud'},
];

// ==================== CUSTOM HOOKS ====================

// Custom Cursor Hook
function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .cat-pill, .product-card, .age-tag, .variant-pill, .filter-chip button')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.2)';
        cursor.style.background = '#8FAF8A';
        follower.style.opacity = '0.2';
      }
    };

    const handleMouseOut = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = '#C97B5A';
      follower.style.opacity = '0.45';
    };

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animateFollower();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return { cursorRef, followerRef };
}

// ==================== HELPER FUNCTIONS ====================

const getBgGradient = (bg: string): string => {
  const gradients: Record<string, string> = {
    'img-bg-1': 'from-[#FDE8E0] to-[#F2C4B2]',
    'img-bg-2': 'from-[#E0EDD8] to-[#C5DFC0]',
    'img-bg-3': 'from-[#EDE8F8] to-[#D4C8E8]',
    'img-bg-4': 'from-[#FFF3D4] to-[#FFE4A0]',
    'img-bg-5': 'from-[#D4E8F0] to-[#A8CDD8]',
    'img-bg-6': 'from-[#F8E8F0] to-[#E8C0D8]',
    'img-bg-7': 'from-[#E8F4F0] to-[#B8DDD5]',
    'img-bg-8': 'from-[#FDE8D8] to-[#F0C098]',
  };
  return gradients[bg] || 'from-[#FDE8E0] to-[#F2C4B2]';
};

const renderStars = (rating: number): string => {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.floor(rating) ? '★' : '☆';
  }
  return stars;
};

// ==================== COMPONENTS ====================

// Product Card Component
function ProductCard({ 
  product, 
  viewMode,
  cartCounts,
  onQtyChange,
  onWishlistToggle,
  onQuickView 
}: { 
  product: Product;
  viewMode: 'grid' | 'list';
  cartCounts: Record<number, number>;
  onQtyChange: (id: number, delta: number) => void;
  onWishlistToggle: (id: number) => void;
  onQuickView: (product: Product) => void;
}) {
  const qty = cartCounts[product.id] || 0;
  const [isWished, setIsWished] = useState(false);

  const bgGradient = getBgGradient(product.bg);

  return (
    <div 
      className={`product-card rounded-[20px] overflow-visible cursor-pointer bg-warm-white relative transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-charcoal/10 ${viewMode === 'list' ? 'grid grid-cols-[220px_1fr] rounded-[16px]' : ''}`}
      onClick={() => onQuickView(product)}
    >
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'rounded-l-[16px] aspect-auto h-[180px]' : 'aspect-square rounded-t-[16px]'}`}>
        <div className={`w-full h-full flex items-center justify-center text-[72px] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 bg-gradient-to-br ${bgGradient}`}>
          {product.emoji}
        </div>
        
        {product.badge && (
          <span className={`absolute top-3 left-3 z-[3] px-[11px] py-1 rounded-full text-[10px] tracking-[0.08em] uppercase font-semibold ${product.badgeType === 'sale' ? 'bg-clay' : product.badgeType === 'new' ? 'bg-sage-dark' : 'bg-[#E07070]'} text-white`}>
            {product.badge}
          </span>
        )}
        
        <div className="absolute top-3 right-3 z-[3] flex flex-col gap-1.5 opacity-0 translate-x-2.5 transition-all duration-300 hover:opacity-100 hover:translate-x-0 group-hover:opacity-100 group-hover:translate-x-0">
          <button 
            className={`w-8.5 h-8.5 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center text-[15px] shadow-[0_2px_12px_rgba(44,44,44,0.12)] transition-all duration-250 hover:scale-115 hover:bg-white ${isWished ? 'text-clay' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsWished(!isWished); onWishlistToggle(product.id); }}
          >
            {isWished ? '♥' : '♡'}
          </button>
          <button 
            className="w-8.5 h-8.5 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center text-[15px] shadow-[0_2px_12px_rgba(44,44,44,0.12)] transition-all duration-250 hover:scale-115 hover:bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            ↗
          </button>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 bg-charcoal/82 backdrop-blur-[6px] rounded-b-[16px] flex items-center justify-center py-3.5 opacity-0 translate-y-2 transition-all duration-300 cursor-pointer z-[2]"
          onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
        >
          <span className="text-white text-[12px] tracking-[0.12em] uppercase font-medium">Quick View</span>
        </div>
      </div>

      <div className={`p-4 pb-[18px] ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-clay font-medium mb-1.5">{product.cat}</div>
          <h3 className="font-display text-[19px] font-normal text-charcoal leading-tight mb-1.25">{product.name}</h3>
          <p className="text-[12px] text-muted leading-relaxed mb-3">{product.desc}</p>
          <div className="flex items-center gap-1.25 mb-3.5">
            <span className="text-gold text-[12px] tracking-[1px]">{renderStars(product.rating)}</span>
            <span className="text-[12px] text-muted">{product.rating} ({product.reviews.toLocaleString()})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[20px] font-medium text-charcoal">${product.price}.00</span>
            {product.oldPrice && (
              <span className="text-[13px] text-muted line-through">${product.oldPrice}</span>
            )}
          </div>
          
          <div className="flex items-center gap-0 bg-clay rounded-full overflow-hidden transition-transform duration-250 hover:scale-105">
            {qty > 0 ? (
              <>
                <button 
                  className="w-8 h-8 border-none bg-transparent text-white text-[18px] cursor-pointer flex items-center justify-center hover:bg-white/15"
                  onClick={(e) => { e.stopPropagation(); onQtyChange(product.id, -1); }}
                >
                  −
                </button>
                <span className="text-[13px] text-white px-2.5 font-medium min-w-[28px] text-center">{qty}</span>
              </>
            ) : null}
            <button 
              className="w-8 h-8 border-none bg-transparent text-white text-[18px] cursor-pointer flex items-center justify-center hover:bg-white/15"
              onClick={(e) => { e.stopPropagation(); onQtyChange(product.id, 1); }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick View Modal
function QuickViewModal({ 
  product, 
  isOpen, 
  onClose,
  onQtyChange,
  cartCounts 
}: { 
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onQtyChange: (id: number, delta: number) => void;
  cartCounts: Record<number, number>;
}) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!product) return null;

  const bgGradient = getBgGradient(product.bg);
  const qty = cartCounts[product.id] || 0;
  const savings = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-charcoal/55 backdrop-blur-[8px] flex items-center justify-center transition-opacity duration-35 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="bg-warm-white rounded-[24px] max-w-[820px] w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-[0_32px_80px_rgba(44,44,44,0.25)] transition-transform duration-40 ease-[cubic-bezier(0.22,1,0.36,1)]"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)' }}
      >
        {/* Image Side */}
        <div className={`relative rounded-[24px_0_0_24px] overflow-hidden min-h-[380px] flex items-center justify-center bg-gradient-to-br ${bgGradient}`}>
          <button 
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 border-none cursor-pointer text-[16px] flex items-center justify-center hover:bg-white transition-colors z-[2]"
            onClick={onClose}
          >
            ✕
          </button>
          <span className="text-[100px]">{product.emoji}</span>
        </div>

        {/* Content Side */}
        <div className="p-9 pb-8 flex flex-col">
          <div className="text-[11px] tracking-[0.2em] uppercase text-clay font-medium mb-2">{product.cat}</div>
          <h2 className="font-display text-[30px] font-normal leading-tight mb-2">{product.name}</h2>
          <div className="flex items-center gap-1.5 mb-4 text-[13px] text-muted">
            <span className="text-gold">{renderStars(product.rating)}</span>
            <span>{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex gap-4 mb-5.5">
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <span>🌱</span> Organic
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <span>🛡️</span> BPA-free
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <span>✈️</span> Free shipping
            </div>
          </div>

          <p className="text-[14px] text-muted leading-relaxed mb-6">
            {product.desc} Meets or exceeds all ASTM and CPSC safety standards.
          </p>

          <div className="mb-5.5">
            <h4 className="text-[12px] tracking-[0.12em] uppercase text-charcoal mb-2.5 font-medium">Size / Variant</h4>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant, i) => (
                <div
                  key={variant}
                  className={`variant-pill px-4 py-1.75 rounded-[20px] border border-clay/14 text-[13px] cursor-pointer transition-all hover:border-clay hover:text-clay ${selectedVariant === i ? 'bg-clay border-clay text-white' : 'text-muted'}`}
                  onClick={() => setSelectedVariant(i)}
                >
                  {variant}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-[28px] font-medium text-charcoal">${product.price}.00</span>
            {product.oldPrice && (
              <>
                <span className="text-[16px] text-muted line-through">${product.oldPrice}</span>
                <span className="px-2.5 py-1 bg-clay-light text-clay rounded-[6px] text-[12px] font-semibold">Save {savings}%</span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2.5 mt-auto">
            <button 
              className="w-full py-[15px] rounded-full border-none bg-clay text-white font-body text-[13px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 hover:bg-[#b56a49] hover:-translate-y-0.5"
              onClick={() => onQtyChange(product.id, 1)}
            >
              {qty > 0 ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="w-full py-[15px] rounded-full border border-clay/14 bg-transparent text-muted font-body text-[13px] tracking-[0.1em] uppercase cursor-pointer transition-all hover:border-charcoal hover:text-charcoal">
              View Full Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Filter Sheet
function MobileFilterSheet({ 
  isOpen, 
  onClose,
  onApply 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <>
      <div 
        className={`fixed inset-0 z-[900] bg-charcoal/45 backdrop-blur-[4px] transition-opacity duration-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[901] bg-warm-white rounded-[24px_24px_0_0] max-h-[85vh] overflow-y-auto transition-transform duration-40 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-10 h-1 bg-clay/14 rounded-[4px] mx-auto mt-4 mb-6" />
        <div className="flex items-center justify-between mb-5 px-6">
          <h3 className="font-display text-[24px] font-normal">Filters</h3>
          <button 
            className="w-9 h-9 rounded-full border-none bg-clay-light cursor-pointer text-[16px] flex items-center justify-center"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {/* Simplified filter content for mobile */}
        <div className="px-6 pb-10">
          <p className="text-muted text-sm">Filter options same as desktop sidebar.</p>
        </div>

        <button 
          className="fixed bottom-0 left-0 right-0 py-[15px] border-none bg-clay text-white font-body text-[13px] tracking-[0.1em] uppercase cursor-pointer font-medium"
          onClick={onApply}
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}

// Active Filter Chips
function ActiveFilters({ 
  filters, 
  onRemoveCategory,
  onRemovePrice,
  onRemoveAge 
}: { 
  filters: FilterState;
  onRemoveCategory: () => void;
  onRemovePrice: () => void;
  onRemoveAge: (age: string) => void;
}) {
  const hasFilters = filters.category !== 'All' || filters.maxPrice < 200 || filters.ages.size > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {filters.category !== 'All' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          {filters.category}
          <button onClick={onRemoveCategory} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      )}
      {filters.maxPrice < 200 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          Under ${filters.maxPrice}
          <button onClick={onRemovePrice} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      )}
      {Array.from(filters.ages).map(age => (
        <div key={age} className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          {age}
          <button onClick={() => onRemoveAge(age)} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      ))}
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="text-center py-20 px-10 col-span-full">
      <div className="text-[64px] mb-5">🔍</div>
      <h3 className="font-display text-[28px] font-normal mb-2.5">No products found</h3>
      <p className="text-muted text-[14px]">Try adjusting your filters</p>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ProductListing() {
  const { cursorRef, followerRef } = useCustomCursor();
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    maxPrice: 150,
    ages: new Set(['0–3 mo']),
    brands: [],
    ratings: [],
  });
  
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartCounts, setCartCounts] = useState<Record<number, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  // Filter and sort products
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (filters.category !== 'All' && product.cat !== filters.category) return false;
    if (product.price > filters.maxPrice) return false;
    if (filters.ages.size > 0 && !filters.ages.has(product.age)) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  const displayedProducts = filteredProducts.slice(0, displayedCount);

  // Handlers
  const handleQtyChange = (id: number, delta: number) => {
    setCartCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleWishlistToggle = (_id: number) => {
    // Handle wishlist toggle logic
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'All',
      maxPrice: 150,
      ages: new Set(['0–3 mo']),
      brands: [],
      ratings: [],
    });
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || allLoaded) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 200;
      
      if (scrollPosition >= threshold) {
        setIsLoading(true);
        setTimeout(() => {
          setDisplayedCount(prev => {
            const newCount = prev + 12;
            if (newCount >= filteredProducts.length) {
              setAllLoaded(true);
            }
            return newCount;
          });
          setIsLoading(false);
        }, 900);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, allLoaded, filteredProducts.length]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(12);
    setAllLoaded(false);
  }, [filters, sortBy]);

  return (
    <>
      {/* Custom Cursor */}
      <div 
        ref={cursorRef} 
        className="fixed w-2.5 h-2.5 bg-clay rounded-full pointer-events-none z-[9999] mix-blend-multiply transition-transform duration-120"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={followerRef} 
        className="fixed w-8.5 h-8.5 border border-clay rounded-full pointer-events-none z-[9998] opacity-45 transition-transform duration-220 ease-out"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        onQtyChange={handleQtyChange}
        cartCounts={cartCounts}
      />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet 
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        onApply={() => setIsMobileSheetOpen(false)}
      />

      <div className="flex min-h-screen pt-[72px]">
        {/* Sidebar - Visible on desktop (lg = 1024px+) */}
        <div className="hidden lg:block xl:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClearAll={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-7 pb-20 lg:p-7">
          {/* Toolbar - Visible only on mobile, hidden on desktop */}
          <div className="lg:hidden flex items-center justify-between mb-7 pb-[22px] border-b border-clay/14 flex-wrap gap-3.5">
            <div className="toolbar-left">
              <h1 className="font-display text-[34px] font-light tracking-tight leading-[1.1]">
                All <em className="italic text-clay">Products</em>
              </h1>
              <p className="text-[13px] text-muted mt-1">
                Showing {Math.min(displayedCount, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button 
                className="lg:hidden flex items-center gap-2 px-[18px] py-2.5 rounded-[10px] border border-clay/14 bg-warm-white font-body text-[13px] text-charcoal cursor-pointer transition-all hover:border-clay hover:text-clay"
                onClick={() => setIsMobileSheetOpen(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                Filters
              </button>

              {/* Sort Select */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-3.5 py-2.25 pr-9 rounded-[10px] border border-clay/14 bg-warm-white font-body text-[13px] text-charcoal cursor-pointer outline-none transition-colors hover:border-clay focus:border-clay"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted pointer-events-none">↕</span>
              </div>

              {/* View Toggle */}
              <div className="flex gap-1">
                <button 
                  className={`w-8.5 h-8.5 rounded-[8px] border border-clay/14 bg-transparent cursor-pointer flex items-center justify-center text-muted transition-all ${viewMode === 'grid' ? 'border-clay text-clay bg-clay-light' : 'hover:border-clay hover:text-clay'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button 
                  className={`w-8.5 h-8.5 rounded-[8px] border border-clay/14 bg-transparent cursor-pointer flex items-center justify-center text-muted transition-all ${viewMode === 'list' ? 'border-clay text-clay bg-clay-light' : 'hover:border-clay hover:text-clay'}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
                    <circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters 
            filters={filters}
            onRemoveCategory={() => setFilters(prev => ({ ...prev, category: 'All' }))}
            onRemovePrice={() => setFilters(prev => ({ ...prev, maxPrice: 200 }))}
            onRemoveAge={(age) => {
              const newAges = new Set(filters.ages);
              newAges.delete(age);
              setFilters(prev => ({ ...prev, ages: newAges }));
            }}
          />

          {/* Product Grid */}
          <div 
            className={`grid gap-5.5 transition-all duration-300 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} ${viewMode === 'list' ? 'list-view' : ''}`}
          >
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${(index % 12) * 40}ms` }}
                  className="animate-[cardIn_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
                >
                  <ProductCard 
                    product={product}
                    viewMode={viewMode}
                    cartCounts={cartCounts}
                    onQtyChange={handleQtyChange}
                    onWishlistToggle={handleWishlistToggle}
                    onQuickView={handleQuickView}
                  />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="h-[60px] flex items-center justify-center mt-5">
              <div className="w-9 h-9 border-3 border-clay-light border-t-clay rounded-full animate-spin" />
            </div>
          )}

          {/* All Loaded Message */}
          {allLoaded && displayedProducts.length > 0 && (
            <div className="text-center py-8 text-muted text-[13px] tracking-[0.1em] uppercase">
              ✦ You've seen everything ✦
            </div>
          )}
        </main>
      </div>
    </>
  );
}

