import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ==================== TYPES ====================

interface Slide {
  emoji: string;
  bg: string;
  label: string;
  tag: string;
}

interface Review {
  name: string;
  meta: string;
  avatar: string;
  bg: string;
  stars: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  photos: boolean;
}

interface CarouselProduct {
  emoji: string;
  bg: string;
  cat: string;
  name: string;
  rating: string;
  price: string;
}

// ==================== DATA ====================

const COLOR_PALETTES: Record<string, { emoji: string; bgs: string[] }> = {
  'Lavender Dream': {
    emoji: '🌙',
    bgs: [
      'linear-gradient(135deg,#EDE8F8,#D4C8E8)',
      'linear-gradient(155deg,#E4DDF4,#C8BEE0)',
      'linear-gradient(115deg,#F2EEF8,#D0C6E6)',
      'linear-gradient(145deg,#DDD5EB,#BAB0D4)',
      'linear-gradient(130deg,#E8E2F4,#CAC0DC)',
    ],
  },
  'Sunset Blush': {
    emoji: '🌸',
    bgs: [
      'linear-gradient(135deg,#FDE8E0,#F2C4B2)',
      'linear-gradient(155deg,#FAE0D6,#EDBAAA)',
      'linear-gradient(115deg,#FDEEE8,#F5CCBC)',
      'linear-gradient(145deg,#F5D8CC,#E8AA96)',
      'linear-gradient(130deg,#FAE6DE,#F0C0A8)',
    ],
  },
  'Sage Forest': {
    emoji: '🌿',
    bgs: [
      'linear-gradient(135deg,#E0EDD8,#C5DFC0)',
      'linear-gradient(155deg,#D6E8CC,#BBDAB4)',
      'linear-gradient(115deg,#E8F2E2,#CCE4C8)',
      'linear-gradient(145deg,#CCDEC4,#AACED0)',
      'linear-gradient(130deg,#DDEBD4,#C0DCBC)',
    ],
  },
  'Warm White': {
    emoji: '☁️',
    bgs: [
      'linear-gradient(135deg,#F8F5F0,#EEE8E0)',
      'linear-gradient(155deg,#F5F2EC,#EAE4D8)',
      'linear-gradient(115deg,#FAF8F4,#F0EBE2)',
      'linear-gradient(145deg,#F0EDE6,#E4DDD2)',
      'linear-gradient(130deg,#F6F3EE,#ECE6DC)',
    ],
  },
  'Midnight Noir': {
    emoji: '🌑',
    bgs: [
      'linear-gradient(135deg,#4A4540,#2C2C2C)',
      'linear-gradient(155deg,#423E3A,#262626)',
      'linear-gradient(115deg,#504B46,#323232)',
      'linear-gradient(145deg,#3A3630,#222222)',
      'linear-gradient(130deg,#46423C,#2A2A2A)',
    ],
  },
};

const SLIDE_VIEWS = [
  { label: 'Luna Sound Machine · Front View', tag: 'Front' },
  { label: 'Speaker Grille · Side Profile', tag: '30 Sounds' },
  { label: 'Amber Nightlight · Glow Mode', tag: 'Night Glow' },
  { label: 'USB-C Port · Back Panel', tag: 'USB-C' },
  { label: 'Gift-Ready Packaging · Unboxing', tag: 'Gift Box' },
];

const REVIEWS_DATA: Review[] = [
  {name:'Sarah M.',meta:'Mother of 2 · New York',avatar:'👩',bg:'linear-gradient(135deg,#F2C4B2,#C97B5A)',stars:5,date:'March 1, 2025',title:'Life-changing for our whole family',body:'I was sceptical — we had tried three other sound machines. Nothing worked. Luna had our daughter sleeping 8 hours straight by night four. The amber light is genuinely different from other products, and the seamless looping means no jarring cuts that wake her up. Worth every penny and then some.',verified:true,helpful:312,photos:true},
  {name:'James & Elena K.',meta:'First-time parents · Seattle',avatar:'👨',bg:'linear-gradient(135deg,#D4E8F0,#8FAF8A)',stars:5,date:'Feb 18, 2025',title:'Our paediatrician recommended it',body:"Our son's sleep consultant specifically recommended Luna after we described his sleep issues. The brown noise setting combined with the amber glow at lowest brightness has worked perfectly. Also love that it runs on batteries for travel.",verified:true,helpful:187,photos:false},
  {name:'Priya R.',meta:'Mom of 3 · Chicago',avatar:'👩',bg:'linear-gradient(135deg,#D8D0E8,#9B91C0)',stars:5,date:'Feb 10, 2025',title:'Buying one for every baby shower gift',body:"On my third child, I wish I had discovered Lumi sooner. I've now gifted this to four friends and every single one has thanked me. The build quality is noticeably better than competitors — feels solid and premium.",verified:true,helpful:243,photos:false},
  {name:'Marcus T.',meta:'Dad · Austin, TX',avatar:'🧑',bg:'linear-gradient(135deg,#FDE8E0,#F2C4B2)',stars:4,date:'Jan 29, 2025',title:'Excellent product, minor UI learning curve',body:'The sound quality and light are genuinely excellent. It took me about 10 minutes to figure out all the button combinations. Once you learn it, it\'s very intuitive. Would absolutely buy again.',verified:true,helpful:98,photos:false},
  {name:'Diane L.',meta:'Grandmother · Portland',avatar:'👩',bg:'linear-gradient(135deg,#E0EDD8,#C5DFC0)',stars:5,date:'Jan 15, 2025',title:'Bought for my granddaughter, everyone loves it',body:"My daughter didn't ask for this, I just bought it as a bonus gift. Now it's the first thing she packs when they travel. The packaging alone felt like a luxury product.",verified:false,helpful:156,photos:true},
];

const CAROUSEL_PRODUCTS: CarouselProduct[] = [
  {emoji:'⭐', bg:'linear-gradient(135deg,#FFF3D4,#FFE4A0)', cat:'Nursery', name:'Star Projector Pro', rating:'4.8', price:'$72'},
  {emoji:'🛏', bg:'linear-gradient(135deg,#D4E8F0,#A8CDD8)', cat:'Nursery', name:'Organic Crib Sheets', rating:'4.8', price:'$62'},
  {emoji:'📡', bg:'linear-gradient(135deg,#EDE8F8,#D4C8E8)', cat:'Nursery', name:'Smart Baby Monitor', rating:'4.8', price:'$198'},
  {emoji:'🌿', bg:'linear-gradient(135deg,#E0EDD8,#C5DFC0)', cat:'Nursery', name:'Air Purifier Mini', rating:'4.7', price:'$88'},
  {emoji:'💡', bg:'linear-gradient(135deg,#FDE8E0,#F2C4B2)', cat:'Nursery', name:'Sunrise Wake Light', rating:'4.9', price:'$58'},
  {emoji:'🧸', bg:'linear-gradient(135deg,#FFF3D4,#FFE4A0)', cat:'Toys', name:'Soothe & Snuggle Bear', rating:'4.9', price:'$48'},
];

// ==================== CUSTOM HOOKS ====================

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
      if (target.closest('button, a, .swatch, .gallery-thumb, .carousel-card, .review-card, .size-btn, .carr-add')) {
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

const renderStars = (rating: number): string => {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.floor(rating) ? '★' : '★';
  }
  return stars;
};

// ==================== MAIN COMPONENT ====================

export default function ProductDetails() {
  const { cursorRef, followerRef } = useCustomCursor();

  // State
  const [activeColorName, setActiveColorName] = useState('Lavender Dream');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedPack, setSelectedPack] = useState('Standard (30 sounds)');
  const [currentPrice, setCurrentPrice] = useState(54);
  const [qty, setQty] = useState(1);
  const [cartCount, setCartCount] = useState(3);
  const [isWished, setIsWished] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('Added to cart!');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [carouselPos, setCarouselPos] = useState(0);

  // Build slides based on active color
  const buildSlides = (): Slide[] => {
    const p = COLOR_PALETTES[activeColorName];
    return SLIDE_VIEWS.map((v, i) => ({ emoji: p.emoji, bg: p.bgs[i], label: v.label, tag: v.tag }));
  };
  const slides = buildSlides();

  // Tab panels
  const tabs = ['description', 'specs', 'care', 'reviews'];

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      const priceBlock = document.querySelector('.price-block');
      if (priceBlock) {
        const rect = priceBlock.getBoundingClientRect();
        setIsStickyVisible(rect.bottom < 72);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  // Handlers
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  const setSlide = (i: number) => {
    setCurrentSlide(i);
    setIsZoomed(false);
  };

  const prevSlide = () => setSlide((currentSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => setSlide((currentSlide + 1) % slides.length);

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const selectColor = (colorName: string) => {
    setActiveColorName(colorName);
  };

  const selectPack = (pack: string, price: number) => {
    setSelectedPack(pack);
    setCurrentPrice(price);
  };

  const changeQty = (delta: number) => {
    setQty(Math.max(1, Math.min(10, qty + delta)));
  };

  const addToCart = () => {
    setCartCount(cartCount + qty);
    showToast(`${qty} item${qty > 1 ? 's' : ''} added to cart`);
  };

  const toggleWish = () => {
    setIsWished(!isWished);
    if (!isWished) showToast('Saved to your wishlist ♥');
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  };

  const filterReviews = (filter: string) => {
    setReviewFilter(filter);
  };

  const getCardsVisible = () => {
    const w = window.innerWidth;
    if (w <= 480) return 1.2;
    if (w <= 768) return 1.8;
    if (w <= 1100) return 2;
    return 4;
  };

  const moveCarousel = (dir: number) => {
    const maxPos = Math.max(0, CAROUSEL_PRODUCTS.length - Math.floor(getCardsVisible()));
    setCarouselPos(Math.max(0, Math.min(maxPos, carouselPos + dir)));
  };

  // Rating bars data
  const ratingBars = [
    { stars: 5, pct: 87 },
    { stars: 4, pct: 9 },
    { stars: 3, pct: 2 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  // Filtered reviews
  const filteredReviews = REVIEWS_DATA.filter(r => {
    if (reviewFilter === '5') return r.stars === 5;
    if (reviewFilter === '4') return r.stars === 4;
    if (reviewFilter === 'photos') return r.photos;
    if (reviewFilter === 'verified') return r.verified;
    return true;
  });

  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-[10px] h-[10px] bg-[#C97B5A] rounded-full pointer-events-none z-[9999] mix-blend-multiply transition-transform duration-120"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed w-[34px] h-[34px] border border-[#C97B5A] rounded-full pointer-events-none z-[9998] opacity-40 transition-transform duration-220 ease-out"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Toast */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9000] bg-[#2C2C2C] text-white px-7 py-3.5 rounded-[50px] text-[13px] tracking-[0.04em] flex items-center gap-2.5 shadow-[0_8px_32px_rgba(44,44,44,0.25)] transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <span>🛍</span>
        <span>{toastMsg}</span>
      </div>





      <div className="pt-[68px]">
        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Gallery */}
          <div className="relative h-[70vw] lg:h-[calc(100vh-68px)] lg:sticky lg:top-[68px] bg-[#FFFAF5] overflow-hidden flex flex-col">
            {/* Main Image */}
            <div
              className={`flex-1 relative overflow-hidden cursor-zoom-in flex items-center justify-center ${isZoomed ? 'zoomed' : ''}`}
              onClick={toggleZoom}
            >
              {/* Badges */}
              <div className="absolute top-5 left-5 z-[5] flex flex-col gap-1.75">
                <div className="px-3 py-1.25 rounded-[20px] text-[10px] tracking-[0.1em] uppercase font-semibold bg-[#C97B5A] text-white">★ Bestseller</div>
                <div className="px-3 py-1.25 rounded-[20px] text-[10px] tracking-[0.1em] uppercase font-semibold bg-[#2C2C2C] text-white">🏆 Award 2024</div>
              </div>

              {/* Main Display */}
              <div
                className="w-full h-full flex items-center justify-center transition-all duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  background: slides[currentSlide].bg,
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)'
                }}
              >
                <span className="text-[clamp(120px,15vw,180px)]">{slides[currentSlide].emoji}</span>
              </div>

              {/* Color Label */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[5] bg-white/88 backdrop-blur-[8px] px-4.5 py-1.75 rounded-[20px] text-[12px] text-[#2C2C2C] border border-[rgba(201,123,90,0.13)] whitespace-nowrap">
                {slides[currentSlide].label}
              </div>

              {/* Arrows */}
              <button
                className="absolute top-1/2 -translate-y-1/2 left-4 z-[5] w-10.5 h-10.5 rounded-full bg-white/90 border border-[rgba(201,123,90,0.13)] cursor-pointer flex items-center justify-center text-[#2C2C2C] transition-all duration-250 hover:bg-white hover:shadow-[0_6px_24px_rgba(44,44,44,0.15)] hover:scale-[1.08]"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              >
                ‹
              </button>
              <button
                className="absolute top-1/2 -translate-y-1/2 right-4 z-[5] w-10.5 h-10.5 rounded-full bg-white/90 border border-[rgba(201,123,90,0.13)] cursor-pointer flex items-center justify-center text-[#2C2C2C] transition-all duration-250 hover:bg-white hover:shadow-[0_6px_24px_rgba(44,44,44,0.15)] hover:scale-[1.08]"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              >
                ›
              </button>

              {/* Mobile Swipe Hint */}
              <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 z-[5] bg-white/85 backdrop-blur-[8px] px-4 py-1.75 rounded-[20px] text-[11px] text-[#7A7068] lg:hidden pointer-events-none tracking-[0.06em]">
                Swipe to explore
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-0 border-t border-[rgba(201,123,90,0.13)] h-[88px] bg-[#FFFAF5] flex-shrink-0">
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className={`flex-1 flex items-center justify-center cursor-pointer border-r border-[rgba(201,123,90,0.13)] relative transition-colors duration-200 ${currentSlide === i ? 'bg-[#FDF6EE]' : ''} hover:bg-[#EDD5C8]`}
                  onClick={() => setSlide(i)}
                >
                  <div
                    className="w-full h-full flex items-center justify-center flex-col gap-1"
                    style={{ background: slide.bg }}
                  >
                    <span className="text-[22px]">{slide.emoji}</span>
                    <span className="text-[9px] tracking-[0.06em] uppercase text-[rgba(44,44,44,0.55)] text-center px-1 leading-tight">
                      {slide.tag}
                    </span>
                  </div>
                  {currentSlide === i && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C97B5A] scale-x-100" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="px-[52px] py-[52px] lg:pb-20 flex flex-col bg-[#FDF6EE]">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#C97B5A] mb-2.5 font-medium flex items-center gap-2.5">
              <span className="w-6 h-[1px] bg-[#C97B5A] block"></span>
              Nursery · Sleep Essentials
            </div>

            <h1 className="font-['Cormorant_Garamond'] text-[clamp(32px,3.5vw,52px)] font-normal leading-[1.1] text-[#2C2C2C] mb-3.5 tracking-tight">
              Luna Sound<br /><em className="italic text-[#C97B5A]">Machine</em>
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-3.5 mb-6 flex-wrap">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-[14px] ${star <= 4 ? 'text-[#C9A96E]' : 'text-[#DDD]'}`}>★</span>
                ))}
              </div>
              <span className="text-[14px] font-medium text-[#2C2C2C]">4.9</span>
              <div className="w-px h-4 bg-[rgba(44,44,44,0.08)]"></div>
              <button className="text-[13px] text-[#C97B5A] underline cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setActiveTab('reviews')}>
                3,102 reviews
              </button>
              <div className="w-px h-4 bg-[rgba(44,44,44,0.08)]"></div>
              <span className="text-[11px] text-[#5C7A57] bg-[rgba(92,122,87,0.1)] px-2.5 py-0.75 rounded-[20px] font-medium">✓ Pediatrician Approved</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="font-['Cormorant_Garamond'] text-[42px] font-normal text-[#2C2C2C] tracking-tight">${currentPrice}.00</span>
              <span className="text-[20px] text-[#7A7068] line-through">$68.00</span>
              <span className="px-3.5 py-1.25 bg-[rgba(201,123,90,0.12)] text-[#C97B5A] rounded-[8px] text-[13px] font-semibold">Save 21%</span>
            </div>

            {/* Short Desc */}
            <p className="text-[15px] text-[#7A7068] leading-[1.8] mb-7 border-l-3 border-[#EDD5C8] pl-[18px]">
              Thirty hand-curated soothing sounds — white noise, nature, lullabies — wrapped in a whisper-soft nightlight with auto-off timer. Engineered for the deepest, safest infant sleep.
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-7 text-[13px]">
              <div className="w-2 h-2 rounded-full bg-[#5C7A57] flex-shrink-0 shadow-[0_0_0_3px_rgba(92,122,87,0.2)]"></div>
              <span className="text-[#2C2C2C] font-medium">In Stock</span>
              <span className="text-[#7A7068]">— Ships within 24 hours</span>
            </div>

            <div className="h-px bg-[rgba(201,123,90,0.13)] my-1 mb-7"></div>

            {/* Color Selector */}
            <div className="mb-7">
              <div className="text-[12px] tracking-[0.12em] uppercase text-[#2C2C2C] font-medium mb-3 flex items-center gap-2">
                Color <span className="text-[#7A7068] font-normal tracking-normal text-[13px]">{activeColorName}</span>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {[
                  { name: 'Lavender Dream', gradient: 'linear-gradient(135deg,#D8D0E8,#9B91C0)' },
                  { name: 'Sunset Blush', gradient: 'linear-gradient(135deg,#F2C4B2,#C97B5A)' },
                  { name: 'Sage Forest', gradient: 'linear-gradient(135deg,#C5DFC0,#5C7A57)' },
                  { name: 'Warm White', gradient: '#F8F5F0', border: '1.5px solid rgba(44,44,44,0.12)' },
                  { name: 'Midnight Noir', gradient: 'linear-gradient(135deg,#3E3832,#2C2C2C)' },
                ].map((color) => (
                  <div
                    key={color.name}
                    className={`w-10 h-10 rounded-full cursor-pointer relative transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.12] shadow-[0_2px_8px_rgba(44,44,44,0.15)] ${activeColorName === color.name ? 'ring-3 ring-[#C97B5A] ring-offset-3' : ''}`}
                    style={{ background: color.gradient, ...(color.border ? { border: color.border } : {}) }}
                    onClick={() => selectColor(color.name)}
                  >
                    {activeColorName === color.name && (
                      <span className={`absolute inset-0 flex items-center justify-center text-white text-[14px] font-semibold ${color.name === 'Warm White' ? 'text-[#2C2C2C]' : ''}`}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sound Pack Selector */}
            <div className="mb-7">
              <div className="text-[12px] tracking-[0.12em] uppercase text-[#2C2C2C] font-medium mb-3 flex items-center gap-2">
                Sound Pack <span className="text-[#7A7068] font-normal tracking-normal text-[13px]">{selectedPack}</span>
              </div>
              <div className="flex gap-2.25 flex-wrap">
                {[
                  { name: 'Standard (30 sounds)', price: 54 },
                  { name: 'Premium (60 sounds)', price: 66, label: 'Premium +30 ' },
                  { name: 'Ultimate Bundle', price: 84 },
                ].map((pack) => (
                  <button
                    key={pack.name}
                    className={`px-5 py-2.5 rounded-[10px] border-[1.5px] bg-transparent font-['DM_Sans'] text-[13px] cursor-pointer transition-all duration-200 ${selectedPack === pack.name ? 'bg-[#C97B5A] border-[#C97B5A] text-white' : 'border-[rgba(201,123,90,0.13)] text-[#7A7068] hover:border-[#C97B5A] hover:text-[#C97B5A] hover:bg-[#EDD5C8]'}`}
                    onClick={() => selectPack(pack.name, pack.price)}
                  >
                    {pack.name}
                    {pack.label && <span className="text-[11px] opacity-70 ml-1">{pack.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex gap-3 mb-[18px] flex-wrap">
              <div className="flex items-center gap-0 border-[1.5px] border-[rgba(201,123,90,0.13)] border-r-full rounded-[50px] overflow-hidden bg-[#FFFAF5] h-[52px] flex-shrink-0">
                <button
                  className="w-[42px] h-[48px] border-none bg-transparent cursor-pointer text-[20px] font-light text-[#2C2C2C] flex items-center justify-center hover:bg-[#EDD5C8] hover:text-[#C97B5A] transition-colors"
                  onClick={() => changeQty(-1)}
                >
                  −
                </button>
                <div className="w-[44px] text-center text-[16px] font-medium text-[#2C2C2C]">{qty}</div>
                <button
                  className="w-[42px] h-[48px] border-none bg-transparent cursor-pointer text-[20px] font-light text-[#2C2C2C] flex items-center justify-center hover:bg-[#EDD5C8] hover:text-[#C97B5A] transition-colors"
                  onClick={() => changeQty(1)}
                >
                  +
                </button>
              </div>
              <button
                className="flex-1 min-w-[180px] h-[52px] leading-[1] rounded-[50px] border-none bg-[#C97B5A] text-white font-['DM_Sans'] text-[13px] tracking-[0.12em] uppercase cursor-pointer transition-all duration-300 hover:bg-[#A35E41] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(201,123,90,0.35)] flex items-center justify-center gap-2 px-7 flex-shrink-0"
                onClick={addToCart}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Add to Cart
              </button>
              <button
                className="w-[52px] h-[52px] rounded-full border-[1.5px] border-[rgba(201,123,90,0.13)] bg-transparent cursor-pointer text-[20px] flex items-center justify-center transition-all duration-250 text-[#7A7068] hover:border-[#C97B5A] hover:text-[#C97B5A] hover:bg-[#EDD5C8]"
                onClick={toggleWish}
              >
                {isWished ? '♥' : '♡'}
              </button>
            </div>

            {/* Trust Row */}
            <div className="flex gap-5 flex-wrap py-[18px] border-t border-b border-[rgba(201,123,90,0.13)] mb-7">
              <div className="flex items-center gap-2 text-[12px] text-[#7A7068]">
                <span className="text-[18px]">🚚</span> Free shipping over $50
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#7A7068]">
                <span className="text-[18px]">↩️</span> 30-day returns
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#7A7068]">
                <span className="text-[18px]">🛡️</span> 2-year warranty
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#7A7068]">
                <span className="text-[18px]">🔒</span> Secure checkout
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex gap-2 flex-wrap mb-7">
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#FFFAF5] border border-[rgba(201,123,90,0.13)] text-[12px] text-[#7A7068]">
                <span className="text-[16px]">🌱</span> BPA-Free
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#FFFAF5] border border-[rgba(201,123,90,0.13)] text-[12px] text-[#7A7068]">
                <span className="text-[16px]">🔇</span> 85dB Max Safe
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#FFFAF5] border border-[rgba(201,123,90,0.13)] text-[12px] text-[#7A7068]">
                <span className="text-[16px]">⏱</span> Auto-off Timer
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#FFFAF5] border border-[rgba(201,123,90,0.13)] text-[12px] text-[#7A7068]">
                <span className="text-[16px]">🌈</span> Nightlight
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#FFFAF5] border border-[rgba(201,123,90,0.13)] text-[12px] text-[#7A7068]">
                <span className="text-[16px]">📶</span> No WiFi Needed
              </div>
            </div>

            {/* Share Row */}
            <div className="flex items-center gap-2.5 text-[12px] text-[#7A7068]">
              <span>Share:</span>
              <button
                className="w-8 h-8 rounded-full border border-[rgba(201,123,90,0.13)] bg-transparent cursor-pointer flex items-center justify-center text-[14px] transition-all duration-200 hover:border-[#C97B5A] hover:text-[#C97B5A] hover:bg-[#EDD5C8]"
                onClick={copyLink}
                title="Copy link"
              >
                🔗
              </button>
              <button
                className="w-8 h-8 rounded-full border border-[rgba(201,123,90,0.13)] bg-transparent cursor-pointer flex items-center justify-center text-[14px] transition-all duration-200 hover:border-[#C97B5A] hover:text-[#C97B5A] hover:bg-[#EDD5C8]"
                title="Pinterest"
              >
                📌
              </button>
              <button
                className="w-8 h-8 rounded-full border border-[rgba(201,123,90,0.13)] bg-transparent cursor-pointer flex items-center justify-center text-[14px] transition-all duration-200 hover:border-[#C97B5A] hover:text-[#C97B5A] hover:bg-[#EDD5C8]"
                title="Facebook"
              >
                📘
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-[#FFFAF5] border-t border-[rgba(201,123,90,0.13)]">
          {/* Tabs Nav */}
          <div className="flex border-b border-[rgba(201,123,90,0.13)] px-12 overflow-x-auto scrollbar-hide sticky top-[68px] bg-[#FFFAF5] z-[100]">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-5 px-7 border-none bg-transparent font-['DM_Sans'] text-[13px] tracking-[0.1em] uppercase cursor-pointer whitespace-nowrap relative transition-colors duration-250 ${activeTab === tab ? 'text-[#2C2C2C] font-medium' : 'text-[#7A7068]'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : tab === 'care' ? 'Care Instructions' : `Reviews (3,102)`}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#C97B5A] scale-x-100" />
                )}
              </button>
            ))}
          </div>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="p-[60px] lg:p-[60px_48px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-[36px] font-normal mb-5 leading-[1.2]">
                  Sleep science meets <em className="italic text-[#C97B5A]">gentle design</em>
                </h2>
                <p className="text-[15px] text-[#7A7068] leading-[1.9] mb-4.5">
                  The Luna Sound Machine was born from one simple truth: the womb is loud. At roughly 85 decibels — equivalent to a running vacuum cleaner — the sounds of your heartbeat, blood flow, and digestion surrounded your baby before birth. Silence, to a newborn, is actually jarring.
                </p>
                <p className="text-[15px] text-[#7A7068] leading-[1.9] mb-4.5">
                  We worked with three pediatric sleep consultants and an acoustics engineer to curate 30 frequency-matched soundscapes that recreate that comforting in-utero environment. Each track is mastered to a safe maximum of 85dB and loops seamlessly — no jarring restarts that could wake a sleeping baby.
                </p>
                <p className="text-[15px] text-[#7A7068] leading-[1.9] mb-7">
                  The built-in warm-amber nightlight emits only long-wavelength light (580nm+), which research shows does not suppress melatonin production in infants — unlike blue-spectrum LEDs found in most baby products. The result: faster sleep onset, fewer night wakings, longer stretches.
                </p>
                <p className="font-['Cormorant_Garamond'] text-[20px] italic text-[#2C2C2C] border-l-[3px] border-[#EDD5C8] pl-5 my-7">
                  "Our daughter went from waking every two hours to sleeping eight-hour stretches within three nights." — James K., Verified Buyer
                </p>
              </div>
              <div>
                <div className="bg-[#FDF6EE] rounded-[20px] p-8 border border-[rgba(201,123,90,0.13)]">
                  <h4 className="font-['Cormorant_Garamond'] text-[22px] font-normal mb-5 text-[#2C2C2C]">What makes Luna different</h4>
                  {[
                    { icon: '🎵', title: '30 Curated Soundscapes', desc: 'White noise, pink noise, brown noise, rain, ocean, heartbeat, lullabies — all acoustically engineered for infant sleep.' },
                    { icon: '🌙', title: 'Melatonin-Safe Nightlight', desc: 'Warm amber LEDs only. No blue light wavelengths that disrupt circadian rhythm development.' },
                    { icon: '⏱', title: 'Smart Timer', desc: '30, 60, 90 minute auto-off — or continuous play. Soft fade-out prevents sudden silence from waking baby.' },
                    { icon: '🔋', title: 'Cord or Battery', desc: 'USB-C power or 3×AA batteries for travel. Maintains settings between sessions.' },
                    { icon: '🧼', title: 'Wipe-Clean Surface', desc: 'Food-grade BPA-free ABS. Antimicrobial coating. Easy to disinfect.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5 py-3.5 border-b border-[rgba(44,44,44,0.08)]">
                      <div className="text-[22px] flex-shrink-0 mt-0.5">{item.icon}</div>
                      <div>
                        <h5 className="text-[14px] font-medium text-[#2C2C2C] mb-0.75">{item.title}</h5>
                        <p className="text-[13px] text-[#7A7068] leading-[1.6]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="p-[60px] lg:p-[60px_48px] grid grid-cols-1 lg:grid-cols-2 gap-10 animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
              <div>
                <div className="rounded-[16px] overflow-hidden border border-[rgba(201,123,90,0.13)]">
                  <div className="bg-[#C97B5A] px-6 py-4 text-[12px] tracking-[0.15em] uppercase text-white font-medium">Technical Specifications</div>
                  {[
                    { key: 'Dimensions', val: '4.5" × 4.5" × 4.8"' },
                    { key: 'Weight', val: '310g (10.9 oz)' },
                    { key: 'Sound Tracks', val: '30 loops (60 w/ Premium)' },
                    { key: 'Volume Range', val: '35dB – 85dB (12 levels)' },
                    { key: 'Nightlight Colors', val: 'Warm amber (580nm)' },
                    { key: 'Timer Options', val: '30 / 60 / 90 min / Continuous' },
                    { key: 'Power', val: 'USB-C (5V 1A) / 3×AA' },
                    { key: 'Battery Life', val: 'Up to 18 hours (mid volume)' },
                  ].map((spec, i) => (
                    <div key={i} className={`flex items-center px-6 py-3.5 border-b border-[rgba(44,44,44,0.08)] ${i % 2 === 0 ? 'bg-[#FDF6EE]' : ''}`}>
                      <span className="text-[13px] text-[#7A7068] flex-1 font-normal">{spec.key}</span>
                      <span className="text-[13px] text-[#2C2C2C] font-medium text-right">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="rounded-[16px] overflow-hidden border border-[rgba(201,123,90,0.13)]">
                  <div className="bg-[#C97B5A] px-6 py-4 text-[12px] tracking-[0.15em] uppercase text-white font-medium">Safety & Materials</div>
                  {[
                    { key: 'Material', val: 'BPA-Free ABS Plastic' },
                    { key: 'Surface Coating', val: 'Antimicrobial (silver-ion)' },
                    { key: 'Age Rating', val: 'Newborn and up' },
                    { key: 'CPSC Compliant', val: 'Yes' },
                    { key: 'ASTM Certified', val: 'F963-23' },
                    { key: 'RoHS Compliant', val: 'Yes' },
                    { key: 'Warranty', val: '2 Years Limited' },
                    { key: 'Country of Origin', val: 'Designed in USA' },
                  ].map((spec, i) => (
                    <div key={i} className={`flex items-center px-6 py-3.5 border-b border-[rgba(44,44,44,0.08)] ${i % 2 === 0 ? 'bg-[#FDF6EE]' : ''}`}>
                      <span className="text-[13px] text-[#7A7068] flex-1 font-normal">{spec.key}</span>
                      <span className="text-[13px] text-[#2C2C2C] font-medium text-right">{spec.val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap mt-8">
                  {['🏅 CPSC Certified', '🌱 BPA-Free', '♻️ RoHS Compliant', '🛡️ ASTM F963'].map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 px-4.5 py-3 bg-[#FFFAF5] border border-[rgba(201,123,90,0.13)] rounded-[12px] text-[12px] text-[#7A7068]">
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Care Tab */}
          {activeTab === 'care' && (
            <div className="p-[60px] lg:p-[60px_48px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
              {[
                { icon: '🧽', title: 'Cleaning', desc: 'Wipe exterior with a damp cloth and mild soap. Never submerge in water or use abrasive cleaners. Dry thoroughly before use. Speaker grille can be gently cleaned with a soft dry brush.' },
                { icon: '🔋', title: 'Battery Care', desc: 'Remove batteries if storing for more than 30 days. Use only alkaline AA batteries — avoid mixing old and new. When using USB-C, the unit does not drain batteries. Store at room temperature.' },
                { icon: '📦', title: 'Storage', desc: 'Store in the original packaging or a padded bag when traveling. Keep away from direct sunlight and extreme temperatures. Unit is not waterproof — keep away from moisture.' },
                { icon: '🌡', title: 'Operating Conditions', desc: 'Designed for indoor use between 50°F–95°F (10°C–35°C). Humidity range: 20–80% non-condensing. Do not use in bathrooms or near water sources. Ensure at least 3ft from the crib.' },
                { icon: '🔧', title: 'Troubleshooting', desc: 'If the unit doesn\'t respond, reset by holding the power button for 8 seconds. For speaker distortion, reduce volume and ensure speaker grille is clear. All repairs must be done by Lumi service centers.' },
                { icon: '📞', title: 'Support', desc: '2-year limited warranty covers all manufacturing defects. Contact support@lumi.com or visit our help center. For warranty claims, keep your original receipt. We respond within 24 hours.' },
              ].map((item, i) => (
                <div key={i} className="bg-[#FDF6EE] rounded-[16px] p-7 border border-[rgba(201,123,90,0.13)] text-center transition-transform duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                  <div className="text-[36px] mb-3.5">{item.icon}</div>
                  <h4 className="font-['Cormorant_Garamond'] text-[20px] font-normal mb-2.5">{item.title}</h4>
                  <p className="text-[13px] text-[#7A7068] leading-[1.7]">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="p-[60px] lg:p-[60px_48px] animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 mb-12 items-start">
                <div className="bg-[#FDF6EE] rounded-[20px] p-9 border border-[rgba(201,123,90,0.13)] text-center">
                  <div className="font-['Cormorant_Garamond'] text-[72px] font-light text-[#2C2C2C] leading-[1]">4.9</div>
                  <div className="text-[22px] text-[#C9A96E] tracking-[2px] mb-4">★★★★★</div>
                  <div className="text-[13px] text-[#7A7068] mb-4">Based on 3,102 reviews</div>
                  <div className="flex flex-col gap-2 mt-5">
                    {ratingBars.map((bar, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[12px] text-[#7A7068]">
                        <span className="text-[#C9A96E]">★</span><span>{bar.stars}</span>
                        <div className="flex-1 h-1.5 bg-[rgba(201,123,90,0.13)] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A96E] rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${bar.pct}%` }}></div>
                        </div>
                        <span>{bar.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 flex-wrap mb-7">
                    {[
                      { label: 'All Reviews', value: 'all' },
                      { label: '★★★★★ 5 stars', value: '5' },
                      { label: '★★★★☆ 4 stars', value: '4' },
                      { label: 'With Photos', value: 'photos' },
                      { label: 'Verified Only', value: 'verified' },
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        className={`px-[18px] py-2 rounded-[20px] border-[1.5px] bg-transparent font-['DM_Sans'] text-[12px] cursor-pointer transition-all duration-200 ${reviewFilter === filter.value ? 'border-[#C97B5A] text-[#C97B5A] bg-[#EDD5C8]' : 'border-[rgba(201,123,90,0.13)] text-[#7A7068] hover:border-[#C97B5A] hover:text-[#C97B5A]'}`}
                        onClick={() => filterReviews(filter.value)}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-6">
                    {filteredReviews.map((review, i) => (
                      <div key={i} className="bg-[#FDF6EE] rounded-[16px] p-7 border border-[rgba(201,123,90,0.13)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(44,44,44,0.07)]" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="flex items-start justify-between mb-3 gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10.5 h-10.5 rounded-full flex items-center justify-center text-[18px]" style={{ background: review.bg }}>{review.avatar}</div>
                            <div>
                              <div className="text-[14px] font-medium text-[#2C2C2C]">{review.name}</div>
                              <div className="text-[12px] text-[#7A7068] mt-0.5">{review.meta}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[13px] text-[#C9A96E]">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</div>
                            <div className="text-[11px] text-[#7A7068] mt-1">{review.date}</div>
                          </div>
                        </div>
                        <div className="font-['Cormorant_Garamond'] text-[18px] font-medium text-[#2C2C2C] mb-2">{review.title}</div>
                        <div className="text-[14px] text-[#7A7068] leading-[1.75]">{review.body}</div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(44,44,44,0.08)]">
                          <span className="text-[12px] text-[#7A7068]">Helpful?</span>
                          <button className="px-[14px] py-1.25 rounded-[20px] border border-[rgba(201,123,90,0.13)] bg-transparent text-[12px] text-[#7A7068] cursor-pointer transition-all duration-200 hover:border-[#C97B5A] hover:text-[#C97B5A]">
                            👍 {review.helpful}
                          </button>
                          {review.verified && <span className="text-[11px] text-[#5C7A57] bg-[rgba(92,122,87,0.08)] px-2.5 py-1 rounded-[20px] font-medium ml-auto">✓ Verified Purchase</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 rounded-[50px] border-[1.5px] border-[#C97B5A] bg-transparent text-[#C97B5A] font-['DM_Sans'] text-[13px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 hover:bg-[#C97B5A] hover:text-white mt-8 font-medium">
                    ✦ Write a Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carousel Section */}
        <div className="px-12 py-20 bg-[#FDF6EE]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#C97B5A] mb-2 font-medium flex items-center gap-2.5">
                <span className="w-6 h-[1px] bg-[#C97B5A] block"></span>You May Also Like
              </div>
              <h2 className="font-['Cormorant_Garamond'] text-[clamp(30px,3vw,46px)] font-normal leading-[1.1]">
                Complete your <em className="italic text-[#C97B5A]">nursery</em>
              </h2>
            </div>
            <div className="flex gap-2.5">
              <button
                className="w-10.5 h-10.5 rounded-full border-[1.5px] border-[rgba(201,123,90,0.13)] bg-transparent cursor-pointer flex items-center justify-center text-[#2C2C2C] transition-all duration-250 hover:bg-[#C97B5A] hover:border-[#C97B5A] hover:text-white"
                onClick={() => moveCarousel(-1)}
              >
                ‹
              </button>
              <button
                className="w-10.5 h-10.5 rounded-full border-[1.5px] border-[rgba(201,123,90,0.13)] bg-transparent cursor-pointer flex items-center justify-center text-[#2C2C2C] transition-all duration-250 hover:bg-[#C97B5A] hover:border-[#C97B5A] hover:text-white"
                onClick={() => moveCarousel(1)}
              >
                ›
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${carouselPos * (100 / 4)}%)` }}
            >
              {CAROUSEL_PRODUCTS.map((product, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[calc(25%-15px)] bg-[#FFFAF5] rounded-[20px] overflow-hidden cursor-pointer transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(44,44,44,0.12)]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="aspect-square flex items-center justify-center relative overflow-hidden" style={{ background: product.bg }}>
                    <div className="transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]">{product.emoji}</div>
                  </div>
                  <div className="p-4 pb-5">
                    <div className="text-[10px] tracking-[0.18em] uppercase text-[#C97B5A] mb-1.25 font-medium">{product.cat}</div>
                    <div className="font-['Cormorant_Garamond'] text-[18px] font-normal text-[#2C2C2C] mb-1 leading-tight">{product.name}</div>
                    <div className="text-[12px] text-[#C9A96E] mb-2.5">{product.rating} ★</div>
                    <div className="flex items-center justify-between">
                      <div className="text-[16px] font-medium text-[#2C2C2C]">{product.price}</div>
                      <button
                        className="w-8 h-8 rounded-full border-none bg-[#C97B5A] text-white text-[18px] cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-[#A35E41] hover:scale-1.1"
                        onClick={(e) => { e.stopPropagation(); showToast('Added to cart!'); }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#2C2C2C] text-white/55 px-12 py-10 flex items-center justify-between flex-wrap gap-4">
          <div className="font-['Cormorant_Garamond'] text-[22px] font-light text-[#FDF6EE]">
            Lumi<span className="text-[#F2C4B2]">✦</span>Baby
          </div>
          <p className="text-[12px]">© 2025 Lumi Baby. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Help'].map((link) => (
              <a key={link} href="#" className="text-[12px] text-white/40 no-underline transition-colors hover:text-[#F2C4B2]">{link}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}

