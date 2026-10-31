import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, Check, ChevronDown, Coffee, Heart, Leaf,
  Menu, Search, ShoppingBag, Sparkles, X
} from "lucide-react";
import ProductCard from "./components/ProductCard";
import CatMascot from "./components/CatMascot";
import { products } from "./data/products";
import { categories } from "./data/categories";
import { siteConfig } from "./config/site";
import { useStoredState } from "./hooks/useStoredState";
import type { TeaProduct, TeaCategory } from "./types/product";

type CartLine = { productId: string; quantity: number };

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export default function App() {
  const [cart, setCart] = useStoredState<CartLine[]>("quiet-leaf-cart", []);
  const [favorites, setFavorites] = useStoredState<string[]>("quiet-leaf-favorites", []);
  const [activeCategory, setActiveCategory] = useState<TeaCategory | "Всё">("Всё");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TeaProduct | null>(null);
  const [toast, setToast] = useState("");
  const [guideMood, setGuideMood] = useState("cozy");

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartLines = cart.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? { ...line, product } : null;
  }).filter((line): line is CartLine & { product: TeaProduct } => Boolean(line));
  const cartTotal = cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => product.available);
    if (activeCategory !== "Всё") result = result.filter((product) => product.category === activeCategory);
    if (favoriteOnly) result = result.filter((product) => favorites.includes(product.id));
    const normalized = search.trim().toLocaleLowerCase("ru");
    if (normalized) {
      result = result.filter((product) =>
        [product.name, product.description, product.category, product.origin, ...product.flavorNotes]
          .join(" ").toLocaleLowerCase("ru").includes(normalized)
      );
    }
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "featured") result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [activeCategory, favoriteOnly, favorites, search, sort]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const addToCart = (product: TeaProduct) => {
    setCart((current) => {
      const found = current.find((line) => line.productId === product.id);
      return found
        ? current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { productId: product.id, quantity: 1 }];
    });
    showToast(`${product.name} добавлен в корзину`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => current
      .map((line) => line.productId === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const scrollToCatalog = () => {
    setFavoriteOnly(false);
    setMobileMenuOpen(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const chooseCategory = (category: TeaCategory) => {
    setActiveCategory(category);
    setFavoriteOnly(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const moodCopy: Record<string, { title: string; text: string; category: TeaCategory }> = {
    cozy: { title: "Пусть вечер станет тише", text: "Мягкий, тёплый пуэр — будто плед и дождь за окном.", category: "Пуэр" },
    bright: { title: "Немного свежести", text: "Зелёный чай с лёгким, чистым и травянистым характером.", category: "Зелёный чай" },
    curious: { title: "Время исследовать", text: "Улун — целый мир ароматов, который раскрывается пролив за проливом.", category: "Улун" },
    gift: { title: "Маленькое путешествие в подарок", text: "Дегустационный набор для тех, кто только знакомится с китайским чаем.", category: "Наборы" },
  };

  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={14} /> {siteConfig.announcement} <span className="announcement-dot">✦</span> Неспешно. С душой.</div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label={siteConfig.name}>
          <span className="brand-mark"><Leaf size={20} /></span>
          <span className="brand-text"><strong>{siteConfig.name}</strong><small>КИТАЙСКАЯ ЧАЙНАЯ</small></span>
        </a>
        <nav className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Главная</a>
          <a href="#catalog" onClick={() => setMobileMenuOpen(false)}>Каталог</a>
          <a href="#story" onClick={() => setMobileMenuOpen(false)}>О чайной</a>
          <a href="#tea-guide" onClick={() => setMobileMenuOpen(false)}>Чайный гид</a>
        </nav>
        <div className="header-actions">
          <button className={`icon-button ${favoriteOnly ? "active" : ""}`} aria-label="Избранное" onClick={() => { setFavoriteOnly(!favoriteOnly); setActiveCategory("Всё"); scrollToCatalog(); setFavoriteOnly(true); }}>
            <Heart size={19} />
            {favorites.length > 0 && <span className="tiny-count">{favorites.length}</span>}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Открыть корзину">
            <ShoppingBag size={18} /><span>Корзина</span><b>{cartCount}</b>
          </button>
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Открыть меню">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow hero-eyebrow"><span /> МАЛЕНЬКАЯ ЧАЙНАЯ В БОЛЬШОМ МИРЕ</div>
            <h1>Там, где время<br /><em>заваривается</em><br />медленно.</h1>
            <p>{siteConfig.heroDescription}</p>
            <div className="hero-actions">
              <button className="button button-light" onClick={scrollToCatalog}>Выбрать чай <ArrowRight size={17} /></button>
              <a className="text-link light-link" href="#story">Открыть чайную <span>↗</span></a>
            </div>
            <div className="hero-note"><span className="note-line" /> Листья, вода и немного тишины</div>
          </div>
          <div className="hero-stamp"><span>一盏茶</span><small>ОДНА ЧАШКА<br />ЗА РАЗ</small></div>
          <a className="scroll-cue" href="#categories"><ArrowDown size={15} /> ЛИСТАЙ НЕ СПЕША</a>
          <div className="hero-side-note">EST. IN A QUIET MOMENT · 茶</div>
        </section>

        <section className="intro-strip">
          <div className="intro-item"><span className="intro-icon"><Leaf size={19} /></span><div><strong>Чай с характером</strong><small>Разные регионы Китая</small></div></div>
          <div className="intro-divider" />
          <div className="intro-item"><span className="intro-icon"><Coffee size={19} /></span><div><strong>Ритуал без спешки</strong><small>Заваривай в своём темпе</small></div></div>
          <div className="intro-divider" />
          <div className="intro-item"><span className="intro-icon"><Sparkles size={19} /></span><div><strong>Маленькие открытия</strong><small>Новый вкус в каждой чашке</small></div></div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="section-heading">
            <div><div className="eyebrow"><span /> НАЧНИ СВОЁ ПУТЕШЕСТВИЕ</div><h2>Какая история<br />тебе <em>сегодня</em> нужна?</h2></div>
            <p>У каждого чая свой характер.<br />Выбери тот, что откликается.</p>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <button className={`category-card category-card-${index + 1}`} key={category.name} onClick={() => chooseCategory(category.name)}>
                <img src={category.image} alt="" loading="lazy" />
                <span className="category-shade" />
                <span className="category-index">0{index + 1}</span>
                <span className="category-info"><strong>{category.name}</strong><small>{category.subtitle}</small></span>
                <span className="category-arrow"><ArrowRight size={17} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="featured-band">
          <div className="featured-copy">
            <div className="eyebrow eyebrow-light"><span /> ИЗ ЛЮБИМЫХ</div>
            <h2>Чай, к которому<br />хочется <em>вернуться.</em></h2>
            <p>Мы собрали небольшую коллекцию для знакомства с китайским чаем. Не нужно знать все названия — просто начни с того, что звучит вкусно.</p>
            <button className="button button-outline-light" onClick={scrollToCatalog}>Смотреть коллекцию <ArrowRight size={16} /></button>
            <div className="featured-decoration">茶 · 茶 · 茶</div>
          </div>
          <div className="featured-image">
            <img src="https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=1400&q=90" alt="Чайный столик с посудой" loading="lazy" />
            <div className="image-caption"><span>一杯好茶</span><small>ХОРОШИЙ ЧАЙ. ХОРОШИЙ МОМЕНТ.</small></div>
          </div>
        </section>

        <section className="section catalog-section" id="catalog">
          <div className="section-heading catalog-heading">
            <div><div className="eyebrow"><span /> НАША ЧАЙНАЯ ПОЛКА</div><h2>{favoriteOnly ? "Твоё избранное" : "Найди свой "}<em>{favoriteOnly ? "уют." : "лист."}</em></h2></div>
            <p>Каждый сорт — маленький мир.<br />Загляни внутрь.</p>
          </div>
          <div className="catalog-tools">
            <div className="catalog-filters">
              <button className={`filter-chip ${activeCategory === "Всё" ? "selected" : ""}`} onClick={() => { setActiveCategory("Всё"); setFavoriteOnly(false); }}>Всё</button>
              {categories.map((category) => <button key={category.name} className={`filter-chip ${activeCategory === category.name ? "selected" : ""}`} onClick={() => { setActiveCategory(category.name); setFavoriteOnly(false); }}>{category.name}</button>)}
            </div>
            <div className="catalog-controls">
              <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти чай..." aria-label="Поиск по чаю" />{search && <button onClick={() => setSearch("")} aria-label="Очистить поиск"><X size={14} /></button>}</label>
              <label className="sort-select"><span>Сортировка</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Сортировка"><option value="featured">Сначала избранное</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select><ChevronDown size={14} /></label>
            </div>
          </div>
          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} onToggleFavorite={toggleFavorite} onAdd={addToCart} onOpen={setSelectedProduct} />)}
            </div>
          ) : (
            <div className="empty-state"><CatMascot /><h3>{favoriteOnly ? "Пока никого не приютили" : "Такого чая пока нет"}</h3><p>{favoriteOnly ? "Нажми на сердечко у чая, который тебе понравился." : "Попробуй изменить поиск или выбрать другую категорию."}</p><button className="button button-dark" onClick={() => { setSearch(""); setActiveCategory("Всё"); setFavoriteOnly(false); }}>Посмотреть весь чай</button></div>
          )}
          <div className="catalog-footnote"><span>✳</span> Ассортимент на этой странице демонстрационный. Реальные сорта, цены и наличие нужно подтвердить перед запуском.</div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image">
            <img src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=85" alt="Уютный чайный уголок" loading="lazy" />
            <div className="story-image-label">慢慢来 · НЕ СПЕШИ</div>
          </div>
          <div className="story-copy">
            <div className="eyebrow"><span /> НЕ ПРОСТО НАПИТОК</div>
            <h2>Маленькая пауза<br />в большом <em>мире.</em></h2>
            <p>Мы верим, что чашка чая — это не только вкус. Это возможность на несколько минут выключить шум, посмотреть на дождь за окном и вернуться к себе.</p>
            <p>Китайская чайная культура огромна и удивительна. Здесь не нужно быть экспертом: можно просто пробовать, замечать оттенки и находить любимое.</p>
            <a className="text-link dark-link" href="#tea-guide">Немного чайной мудрости <ArrowRight size={16} /></a>
            <div className="story-signature"><span>茶</span><small>ЗАВАРИ. ВЫДОХНИ. ПОБУДЬ ЗДЕСЬ.</small></div>
          </div>
        </section>

        <section className="tea-guide-section section" id="tea-guide">
          <div className="guide-top">
            <div><div className="eyebrow"><span /> МАЛЕНЬКИЙ ЧАЙНЫЙ ГИД</div><h2>А что тебе <em>по душе?</em></h2></div>
            <p>Не знаешь, с чего начать?<br />Выбери настроение — подберём направление.</p>
          </div>
          <div className="guide-layout">
            <div className="mood-list">
              <button className={guideMood === "cozy" ? "mood-option mood-active" : "mood-option"} onClick={() => setGuideMood("cozy")}><span>01</span><span><strong>Хочется уюта</strong><small>Дождь, плед и любимая музыка</small></span><ArrowRight size={17} /></button>
              <button className={guideMood === "bright" ? "mood-option mood-active" : "mood-option"} onClick={() => setGuideMood("bright")}><span>02</span><span><strong>Хочется свежести</strong><small>Чистый вкус и лёгкость</small></span><ArrowRight size={17} /></button>
              <button className={guideMood === "curious" ? "mood-option mood-active" : "mood-option"} onClick={() => setGuideMood("curious")}><span>03</span><span><strong>Хочется открытий</strong><small>Новый аромат и новые ноты</small></span><ArrowRight size={17} /></button>
              <button className={guideMood === "gift" ? "mood-option mood-active" : "mood-option"} onClick={() => setGuideMood("gift")}><span>04</span><span><strong>Ищу подарок</strong><small>Пусть будет маленькое чудо</small></span><ArrowRight size={17} /></button>
            </div>
            <div className="guide-result">
              <div className="guide-result-top"><span>ТВОЙ ЧАЙНЫЙ МОМЕНТ</span><Sparkles size={17} /></div>
              <CatMascot />
              <div className="guide-result-copy"><h3>{moodCopy[guideMood].title}</h3><p>{moodCopy[guideMood].text}</p><button className="button button-dark" onClick={() => chooseCategory(moodCopy[guideMood].category)}>Подобрать чай <ArrowRight size={16} /></button></div>
              <span className="guide-deco">茶</span>
            </div>
          </div>
        </section>

        <section className="newsletter">
          <div className="newsletter-art"><span>一</span><span>盏</span><span>茶</span></div>
          <div className="newsletter-copy"><div className="eyebrow eyebrow-light"><span /> ПИСЬМА ИЗ ЧАЙНОЙ</div><h2>Немного тишины<br />в твоей <em>почте.</em></h2><p>Истории о чае, простые советы по завариванию и маленькие открытия.</p></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); showToast("Подписка пока не подключена — добавь интеграцию перед запуском"); }}>
            <label htmlFor="newsletter-email">ТВОЯ ЭЛЕКТРОННАЯ ПОЧТА</label>
            <div className="newsletter-input"><input id="newsletter-email" type="email" required placeholder="hello@example.com" /><button type="submit" aria-label="Подписаться"><ArrowRight size={19} /></button></div>
            <small>Демо-форма: для реальной подписки нужно подключить сервис рассылки.</small>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#home"><span className="brand-mark"><Leaf size={20} /></span><span className="brand-text"><strong>{siteConfig.name}</strong><small>КИТАЙСКАЯ ЧАЙНАЯ</small></span></a>
          <p>{siteConfig.footerNote}<br />Маленькая чайная для больших пауз.</p>
          <div className="footer-links"><a href="#catalog">Каталог</a><a href="#story">О чайной</a><a href="#tea-guide">Чайный гид</a><a href={`mailto:${siteConfig.email}`}>Написать нам</a></div>
          <div className="footer-mascot"><CatMascot compact /><span>茶友 · ЧАЙНЫЙ ДРУГ</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 {siteConfig.name}. Демонстрационный проект.</span><span>Сделано с теплом <Heart size={13} /> и хорошим чаем</span></div>
      </footer>

      {toast && <div className="toast"><Check size={17} /> {toast}</div>}

      {cartOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer" aria-label="Корзина">
            <div className="drawer-header"><div><span className="eyebrow"><span /> ТВОЯ ЧАЙНАЯ КОРЗИНА</span><h2>Собираем <em>уют.</em></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Закрыть корзину"><X /></button></div>
            {cartLines.length === 0 ? <div className="cart-empty"><CatMascot /><h3>Пока здесь тихо</h3><p>Добавь чай, который хочется попробовать.</p><button className="button button-dark" onClick={() => { setCartOpen(false); scrollToCatalog(); }}>В каталог <ArrowRight size={16} /></button></div> : <>
              <div className="cart-items">{cartLines.map(({ product, quantity }) => <div className="cart-line" key={product.id}><img src={product.image} alt="" /><div className="cart-line-info"><strong>{product.name}</strong><small>{product.weight}</small><b>{formatPrice(product.price * quantity)}</b><div className="quantity-control"><button onClick={() => updateQuantity(product.id, -1)} aria-label="Уменьшить количество">−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, 1)} aria-label="Увеличить количество">+</button></div></div><button className="remove-line" onClick={() => setCart((current) => current.filter((line) => line.productId !== product.id))} aria-label="Удалить товар"><X size={15} /></button></div>)}</div>
              <div className="cart-summary"><div><span>Промежуточный итог</span><strong>{formatPrice(cartTotal)}</strong></div><p>Доставка и оплата пока не подключены.</p><button className="button button-dark full-width" onClick={() => showToast("Оформление заказа ещё не подключено")}>Перейти к оформлению <ArrowRight size={16} /></button></div>
            </>}
          </aside>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop product-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <div className="product-modal">
            <button className="modal-close icon-button" onClick={() => setSelectedProduct(null)} aria-label="Закрыть"><X /></button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="product-modal-content"><span className="eyebrow"><span /> {selectedProduct.category}</span><h2>{selectedProduct.name}</h2><p>{selectedProduct.description}</p><div className="flavor-tags">{selectedProduct.flavorNotes.map((note) => <span key={note}>{note}</span>)}</div><div className="brew-card"><div><small>ПРОИСХОЖДЕНИЕ</small><strong>{selectedProduct.origin}</strong></div><div><small>ТЕМПЕРАТУРА</small><strong>{selectedProduct.brewingTemperature}</strong></div><div><small>ЗАВАРИВАНИЕ</small><strong>{selectedProduct.brewingTime}</strong></div></div><div className="modal-buy"><strong>{formatPrice(selectedProduct.price)} <small>/ {selectedProduct.weight}</small></strong><button className="button button-dark" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Добавить в корзину <Plus size={16} /></button></div></div>
          </div>
        </div>
      )}
    </div>
  );
}