import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from '@/lib/db';

const CATEGORIES = [
  { name: 'Burgers', slug: 'burgers', description: 'Juicy flame-grilled burgers with premium toppings', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', sort_order: 1 },
  { name: 'Rice & Biryani', slug: 'rice-biryani', description: 'Fragrant basmati rice and layered biryani', image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', sort_order: 4 },
  { name: 'Wraps & Rolls', slug: 'wraps-rolls', description: 'Loaded wraps and paratha rolls', image_url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400', sort_order: 5 },
  { name: 'Sides & Extras', slug: 'sides-extras', description: 'Fries, dips, and all the good extras', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', sort_order: 6 },
  { name: 'Drinks', slug: 'drinks', description: 'Cold beverages and refreshing drinks', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', sort_order: 7 },
  { name: 'Potato Mania', slug: 'potato-mania', description: 'Crispy golden fries in every style — classic, loaded, curly and waffle', image_url: '/menu/loaded-fries.png', sort_order: 8 },
  { name: 'Lacha Burgers', slug: 'lacha-burgers', description: 'Signature burgers topped with crispy lacha onion rings', image_url: '/menu/lacha-burger.png', sort_order: 9 },
  { name: 'Injected Broast', slug: 'injected-broast', description: 'Juicy pressure-fried broast chicken injected with secret marinade', image_url: '/menu/injected-broast-full.png', sort_order: 10 },
  { name: 'Pizza', slug: 'pizza', description: 'Stone-baked pizzas with bold Pakistani and international flavors', image_url: '/menu/pizza-peri-peri.png', sort_order: 11 },
  { name: 'Sandwich', slug: 'sandwich', description: 'Stacked sandwiches loaded with premium fillings', image_url: '/menu/club-sandwich.png', sort_order: 12 },
];

const MENU_ITEMS = [
  // Burgers
  { name: 'Classic Chapli Burger', slug: 'classic-chapli-burger', description: 'Hand-pressed spiced beef chapli kebab patty in a soft bun with tomatoes and green chutney', cat: 'burgers', price: 450, original_price: null, image_url: '/menu/chapli-burger.png', is_available: true, is_featured: false, calories: null, tags: ['beef','traditional','popular'] },
  { name: 'Double Smash Burger', slug: 'double-smash-burger', description: 'Two smashed beef patties, American cheese, caramelized onions, secret sauce on brioche bun', cat: 'burgers', price: 650, original_price: null, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600', is_available: true, is_featured: false, calories: 840, tags: ['beef','premium'] },
  { name: 'Flamed Kissed Grilled Burger', slug: 'flamed-kissed-grilled-burger', description: 'Flame-grilled beef patty with visible char marks, fresh veggies and smoky barbecue sauce', cat: 'burgers', price: 700, original_price: null, image_url: '/menu/grilled-burger.png', is_available: true, is_featured: false, calories: null, tags: ['beef','grilled'] },
  { name: 'Flare Classic Burger', slug: 'flare-classic-burger', description: 'Quarter-pound flame-grilled beef patty, fresh lettuce, tomato, onion, pickles and our signature Flare sauce', cat: 'burgers', price: 450, original_price: 550, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', is_available: true, is_featured: true, calories: 580, tags: ['bestseller','beef'] },
  { name: 'Long OG Zinger Burger', slug: 'long-og-zinger-burger', description: 'Extra-long crispy zinger chicken fillet burger with our signature sauces and fresh toppings', cat: 'burgers', price: 450, original_price: null, image_url: '/menu/zinger-burger.png', is_available: true, is_featured: false, calories: null, tags: ['chicken'] },
  { name: 'Mazaydawr Beef Smash Burger', slug: 'mazaydawr-beef-smash-burger', description: 'Thin-smashed beef patty with caramelized crust, American cheese and secret sauce — includes fries. Double available.', cat: 'burgers', price: 700, original_price: null, image_url: '/menu/smash-burger.png', is_available: true, is_featured: true, calories: null, tags: ['beef','bestseller','popular'] },
  { name: 'Spicy Flare Burger', slug: 'spicy-flare-burger', description: 'Crispy fried chicken fillet with jalapeños, spicy mayo, coleslaw and pickled chilies', cat: 'burgers', price: 420, original_price: null, image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600', is_available: true, is_featured: true, calories: 620, tags: ['spicy','chicken'] },
  { name: 'The OG Mighty Burger', slug: 'og-mighty-burger', description: 'A mighty stack with double zinger patties, hash brown, cheese and coleslaw — bigger, bolder, better', cat: 'burgers', price: 650, original_price: null, image_url: '/menu/zinger-burger.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','premium','bestseller'] },
  { name: 'The OG Zinger Burger', slug: 'og-zinger-burger', description: 'The original golden crispy fried chicken zinger fillet with lettuce, mayo and pickles in a toasted bun', cat: 'burgers', price: 400, original_price: null, image_url: '/menu/zinger-burger.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  { name: 'Urban Patty Burger', slug: 'urban-patty-burger', description: 'Simple, no-fuss juicy beef patty burger with lettuce, tomato and classic sauces', cat: 'burgers', price: 350, original_price: null, image_url: '/menu/smash-burger.png', is_available: true, is_featured: false, calories: null, tags: ['beef','value'] },
  { name: 'Zinger Tower Burger', slug: 'zinger-tower-burger', description: 'Tall stack with crispy zinger chicken, cheese slice, hash brown, lettuce and chipotle mayo', cat: 'burgers', price: 520, original_price: null, image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600', is_available: true, is_featured: false, calories: 720, tags: ['chicken','popular'] },
  // Rice & Biryani
  { name: 'Beef Biryani', slug: 'beef-biryani', description: 'Slow-dum beef biryani with caramelized onions, whole spices and kewra water', cat: 'rice-biryani', price: 520, original_price: null, image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600', is_available: true, is_featured: false, calories: 730, tags: ['beef'] },
  { name: 'Flare Special Biryani', slug: 'flare-special-biryani', description: 'Aromatic dum biryani with tender chicken, saffron, fried onions and mint', cat: 'rice-biryani', price: 450, original_price: null, image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600', is_available: true, is_featured: true, calories: 680, tags: ['chicken','popular','bestseller'] },
  { name: 'Zeera Rice', slug: 'zeera-rice', description: 'Fluffy basmati rice tempered with cumin, ghee and whole spices', cat: 'rice-biryani', price: 180, original_price: null, image_url: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9db82?w=600', is_available: true, is_featured: false, calories: 320, tags: ['vegetarian','side'] },
  // Wraps & Rolls
  { name: 'Beef Chapli Wrap', slug: 'beef-chapli-wrap', description: 'Crispy chapli kebab, tomato, onion, raita and mint chutney in a paratha', cat: 'wraps-rolls', price: 320, original_price: null, image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', is_available: true, is_featured: false, calories: 480, tags: ['beef'] },
  { name: 'Beef Wrap', slug: 'beef-wrap', description: 'Premium beef strips, caramelized onions, peppers and smoky BBQ sauce in a flour tortilla', cat: 'wraps-rolls', price: 990, original_price: null, image_url: '/menu/beef-wrap.png', is_available: true, is_featured: true, calories: null, tags: ['beef','premium'] },
  { name: 'Chicken Paratha Roll', slug: 'chicken-paratha-roll', description: 'Flaky paratha wrapped around spiced chicken tikka, onions and chutneys', cat: 'wraps-rolls', price: 280, original_price: null, image_url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600', is_available: true, is_featured: true, calories: 420, tags: ['chicken','popular'] },
  { name: 'Cruncy Wrap', slug: 'cruncy-wrap', description: 'Crispy chicken strip wrap with crunchy lettuce, cheese and our signature crunch sauce', cat: 'wraps-rolls', price: 600, original_price: null, image_url: '/menu/beef-wrap.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','crunchy'] },
  { name: 'Grilled Chicken Roll', slug: 'grilled-chicken-roll', description: 'Tender grilled chicken tikka in a soft paratha with onion rings and mint chutney', cat: 'wraps-rolls', price: 550, original_price: null, image_url: '/menu/chicken-roll.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','popular'] },
  { name: 'Malai Boti Roll', slug: 'malai-boti-roll', description: 'Creamy malai-marinated chicken boti pieces wrapped in soft paratha with onions and green chutney', cat: 'wraps-rolls', price: 600, original_price: null, image_url: '/menu/malai-boti-roll.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','creamy','bestseller'] },
  { name: 'Peri Peri Roll', slug: 'peri-peri-roll', description: 'Fiery peri peri marinated grilled chicken in a paratha with coleslaw and hot sauce', cat: 'wraps-rolls', price: 500, original_price: null, image_url: '/menu/peri-peri-roll.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','spicy'] },
  { name: 'Tortilla Wrap', slug: 'tortilla-wrap', description: 'Grilled chicken or beef in a soft flour tortilla with fresh salad and signature sauces', cat: 'wraps-rolls', price: 700, original_price: null, image_url: '/menu/beef-wrap.png', is_available: true, is_featured: false, calories: null, tags: ['popular'] },
  { name: 'Turkish Wrap', slug: 'turkish-wrap', description: 'Turkish-style döner wrap with seasoned meat, garlic sauce, fresh veggies and fries inside', cat: 'wraps-rolls', price: 600, original_price: null, image_url: '/menu/beef-wrap.png', is_available: true, is_featured: false, calories: null, tags: ['popular'] },
  { name: 'Zinger Roll', slug: 'zinger-roll', description: 'Crispy zinger chicken fillet rolled in a soft paratha with mayo and fresh veggies', cat: 'wraps-rolls', price: 600, original_price: null, image_url: '/menu/chicken-roll.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  // Sides & Extras
  { name: 'Coleslaw', slug: 'coleslaw', description: 'Creamy homemade coleslaw with cabbage, carrots and special dressing', cat: 'sides-extras', price: 120, original_price: null, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', is_available: true, is_featured: false, calories: 180, tags: ['vegetarian'] },
  { name: 'Masala Fries', slug: 'masala-fries', description: 'Crispy golden fries tossed in our signature masala seasoning', cat: 'sides-extras', price: 220, original_price: null, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600', is_available: true, is_featured: false, calories: 380, tags: ['vegetarian','popular'] },
  { name: 'Raita', slug: 'raita', description: 'Fresh yogurt raita with cucumber, mint and a dash of chaat masala', cat: 'sides-extras', price: 80, original_price: null, image_url: 'https://images.unsplash.com/photo-1631452180539-c9fa6c5c13a3?w=600', is_available: true, is_featured: false, calories: 90, tags: ['vegetarian'] },
  // Drinks
  { name: 'Mango Lassi', slug: 'mango-lassi', description: 'Thick chilled mango lassi with Chaunsa mangoes and cardamom', cat: 'drinks', price: 200, original_price: null, image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600', is_available: true, is_featured: false, calories: 280, tags: ['cold','seasonal'] },
  { name: 'Regular Drink', slug: 'regular-drink', description: 'Fresh house drink served chilled — ask for today\'s options', cat: 'drinks', price: 120, original_price: null, image_url: '/menu/sky-sip.png', is_available: true, is_featured: false, calories: null, tags: ['cold'] },
  { name: 'Rooh Afza Lemonade', slug: 'rooh-afza-lemonade', description: 'Refreshing lemonade with Rooh Afza rose syrup and fresh mint', cat: 'drinks', price: 180, original_price: null, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600', is_available: true, is_featured: true, calories: 145, tags: ['cold','popular'] },
  { name: 'Sky Sip (Large)', slug: 'sky-sip-large', description: 'Large serving of Flare\'s signature house drink — go big with the full pour.', cat: 'drinks', price: 500, original_price: null, image_url: '/menu/sky-sip.png', is_available: true, is_featured: false, calories: null, tags: ['cold','signature'] },
  { name: 'Sky Sip (Medium)', slug: 'sky-sip-medium', description: 'Flare\'s signature house drink — a refreshing blend of flavors. Ask our team for today\'s special.', cat: 'drinks', price: 350, original_price: null, image_url: '/menu/sky-sip.png', is_available: true, is_featured: true, calories: null, tags: ['cold','signature','popular'] },
  { name: 'Soft Drink (330ml)', slug: 'soft-drink', description: 'Pepsi, 7UP, Mirinda or Mountain Dew — your choice', cat: 'drinks', price: 100, original_price: null, image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600', is_available: true, is_featured: false, calories: 140, tags: ['cold'] },
  { name: 'Soft Drink Tin', slug: 'soft-drink-tin', description: 'Chilled 330ml can — Pepsi, 7UP, Mirinda or Mountain Dew', cat: 'drinks', price: 150, original_price: null, image_url: '/menu/soft-drink-tin.png', is_available: true, is_featured: false, calories: null, tags: ['cold'] },
  // Potato Mania
  { name: 'All Star Loaded Fries', slug: 'all-star-loaded-fries', description: 'Fries loaded with melted cheese, jalapeños, beef crumbles and sour cream — the works', cat: 'potato-mania', price: 500, original_price: 700, image_url: '/menu/loaded-fries.png', is_available: true, is_featured: true, calories: null, tags: ['bestseller','indulgent'] },
  { name: 'Curly Fries', slug: 'curly-fries', description: 'Spiral-cut seasoned curly fries, crispy on the outside, fluffy inside', cat: 'potato-mania', price: 390, original_price: null, image_url: '/menu/curly-fries.png', is_available: true, is_featured: false, calories: null, tags: ['vegetarian','popular'] },
  { name: 'Fire Season Masala Fries', slug: 'fire-season-masala-fries', description: 'Golden fries tossed in fiery masala seasoning with a bold smoky kick', cat: 'potato-mania', price: 350, original_price: null, image_url: '/menu/masala-fries.png', is_available: true, is_featured: true, calories: null, tags: ['spicy','vegetarian','popular'] },
  { name: 'French Fries', slug: 'french-fries', description: 'Classic golden crispy French fries, perfectly salted and served piping hot', cat: 'potato-mania', price: 350, original_price: null, image_url: '/menu/french-fries.png', is_available: true, is_featured: false, calories: null, tags: ['vegetarian','popular'] },
  { name: 'Fries Pizza Affair', slug: 'fries-pizza-affair', description: 'Crispy fries layered with pizza sauce, mozzarella and your favourite pizza toppings', cat: 'potato-mania', price: 500, original_price: 700, image_url: '/menu/fries-pizza-affair.png', is_available: true, is_featured: true, calories: null, tags: ['unique','indulgent'] },
  { name: 'Loaded Curly Fries', slug: 'loaded-curly-fries', description: 'Curly fries topped with our signature cheese sauce and spicy masala drizzle', cat: 'potato-mania', price: 450, original_price: 750, image_url: '/menu/curly-fries.png', is_available: true, is_featured: false, calories: null, tags: ['indulgent','popular'] },
  { name: 'Waffle Fries', slug: 'waffle-fries', description: 'Lattice-cut waffle fries, extra crispy with maximum dipping surface', cat: 'potato-mania', price: 450, original_price: null, image_url: '/menu/waffle-fries.png', is_available: true, is_featured: false, calories: null, tags: ['vegetarian'] },
  // Lacha Burgers
  { name: 'Lacha Behari', slug: 'lacha-behari', description: 'Spiced behari kebab patty burger topped with crispy lacha onions, raita and fresh mint', cat: 'lacha-burgers', price: 750, original_price: null, image_url: '/menu/lacha-burger.png', is_available: true, is_featured: false, calories: null, tags: ['beef','traditional'] },
  { name: 'Lacha Grilled Chicken', slug: 'lacha-grilled-chicken', description: 'Flame-grilled chicken burger crowned with crispy lacha onion rings, garlic aioli and fresh greens', cat: 'lacha-burgers', price: 700, original_price: null, image_url: '/menu/lacha-burger.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','popular','bestseller'] },
  { name: 'Smash Lacha Beef', slug: 'smash-lacha-beef', description: 'Double smash beef patty burger with a tower of crispy lacha onion rings and melted cheese', cat: 'lacha-burgers', price: 750, original_price: null, image_url: '/menu/lacha-burger.png', is_available: true, is_featured: true, calories: null, tags: ['beef','bestseller'] },
  // Injected Broast
  { name: 'Injected Broast Full', slug: 'injected-broast-full', description: 'Whole chicken pressure-fried to crispy perfection, injected with our secret spice marinade for max juiciness', cat: 'injected-broast', price: 2300, original_price: null, image_url: '/menu/injected-broast-full.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','sharing','premium','bestseller'] },
  { name: 'Injected Broast Half', slug: 'injected-broast-half', description: 'Half chicken broast — crispy skin, juicy inside, injected with bold marinade. Perfect for two.', cat: 'injected-broast', price: 1250, original_price: null, image_url: '/menu/injected-broast-half.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','popular'] },
  { name: 'Injected Broast Quarter', slug: 'injected-broast-quarter', description: 'Quarter piece of our signature injected broast — golden crispy skin with a succulent interior', cat: 'injected-broast', price: 650, original_price: null, image_url: '/menu/injected-broast-quarter.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  // Pizza
  { name: 'BBQ Pizza', slug: 'bbq-pizza', description: 'Smoky BBQ sauce, grilled chicken, crispy onions and melted mozzarella. Small, medium or large.', cat: 'pizza', price: 700, original_price: 1650, image_url: '/menu/pizza-bbq.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  { name: 'Cheese Pizza', slug: 'cheese-pizza', description: 'Pure cheese lover\'s dream — layers of mozzarella on classic tomato sauce, simple and perfect. Small, medium or large.', cat: 'pizza', price: 600, original_price: 1500, image_url: '/menu/pizza-chicken-tikka.png', is_available: true, is_featured: false, calories: null, tags: ['vegetarian','popular'] },
  { name: 'Chicken Fajita Pizza', slug: 'chicken-fajita-pizza', description: 'Grilled fajita chicken strips with sautéed peppers, onions and smoky fajita sauce. Small, medium or large.', cat: 'pizza', price: 700, original_price: 1650, image_url: '/menu/pizza-bbq.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  { name: 'Chicken Tikka Pizza', slug: 'chicken-tikka-pizza', description: 'Tangy tikka marinated chicken, onions, peppers and mozzarella on classic tomato base. Small, medium or large.', cat: 'pizza', price: 700, original_price: 1650, image_url: '/menu/pizza-chicken-tikka.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  { name: 'Extreme Malai Boti', slug: 'extreme-malai-boti-pizza', description: 'Creamy white malai sauce, tender boti chicken pieces, caramelized onions and mozzarella. Medium or large.', cat: 'pizza', price: 1500, original_price: 2200, image_url: '/menu/pizza-malai-boti.png', is_available: true, is_featured: true, calories: null, tags: ['chicken','creamy','bestseller'] },
  { name: 'Extreme Peri Peri', slug: 'extreme-peri-peri-pizza', description: 'Bold peri peri sauce base with flame-grilled chicken, bell peppers and chili flakes. Medium or large.', cat: 'pizza', price: 1500, original_price: 2200, image_url: '/menu/pizza-peri-peri.png', is_available: true, is_featured: true, calories: null, tags: ['spicy','chicken','bestseller'] },
  { name: 'Flare by TK Special (Crown Crust)', slug: 'flare-tk-special-crown-crust', description: 'Our signature pizza — malai boti topping on a crown crust stuffed with mini kebabs. The showstopper. Medium or large.', cat: 'pizza', price: 1550, original_price: 2350, image_url: '/menu/pizza-kabab-crust.png', is_available: true, is_featured: true, calories: null, tags: ['signature','premium','bestseller'] },
  { name: 'Kabab Crust Pizza', slug: 'kabab-crust-pizza', description: 'Spiced seekh kabab stuffed in the crust, loaded topping of your choice. A unique Flare creation.', cat: 'pizza', price: 1350, original_price: 1990, image_url: '/menu/pizza-kabab-crust.png', is_available: true, is_featured: true, calories: null, tags: ['unique','beef','premium'] },
  { name: 'Nawabi Pizza', slug: 'nawabi-pizza', description: 'Royal Nawabi-style pizza with rich creamy chicken, saffron hints and premium toppings. Small, medium or large.', cat: 'pizza', price: 700, original_price: 1650, image_url: '/menu/pizza-malai-boti.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','premium'] },
  // Sandwich
  { name: '404 Sando', slug: '404-sando', description: 'The sandwich that can\'t be found anywhere else — a stacked monster of premium fillings you have to try', cat: 'sandwich', price: 750, original_price: null, image_url: '/menu/sando-404.png', is_available: true, is_featured: true, calories: null, tags: ['signature','popular','bestseller'] },
  { name: 'Club Sandwich', slug: 'club-sandwich', description: 'Triple-decker classic club with grilled chicken, egg, lettuce, tomato and mayo on toasted bread', cat: 'sandwich', price: 700, original_price: null, image_url: '/menu/club-sandwich.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','classic'] },
  { name: 'Grilled Sandwich', slug: 'grilled-sandwich', description: 'Golden grilled sandwich with chicken, cheese and vegetables, pressed to perfection', cat: 'sandwich', price: 650, original_price: null, image_url: '/menu/grilled-sandwich.png', is_available: true, is_featured: false, calories: null, tags: ['chicken','popular'] },
  { name: 'Panini Sandwich', slug: 'panini-sandwich', description: 'Italian-style pressed panini with grilled chicken, melted mozzarella and pesto mayo', cat: 'sandwich', price: 650, original_price: null, image_url: '/menu/panini-sandwich.png', is_available: true, is_featured: false, calories: null, tags: ['chicken'] },
  { name: 'Smash Beef Sandwich', slug: 'smash-beef-sandwich', description: 'Smashed beef patty on toasted brioche with caramelized onions, cheese and special sauce', cat: 'sandwich', price: 990, original_price: null, image_url: '/menu/smash-beef-sandwich.png', is_available: true, is_featured: true, calories: null, tags: ['beef','premium','popular'] },
];

const DEALS = [
  { title: 'Family Grill Feast', description: 'Mixed Grill Platter + Flare Special Biryani (x2) + Masala Fries + 4 Soft Drinks. Perfect for a family of 4.', image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800', original_price: 2100, deal_price: 1599, discount_type: 'combo', is_active: true },
  { title: 'Burger Duo Deal', description: '2x Flare Classic Burgers + 2x Masala Fries + 2x Soft Drinks', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', original_price: 1340, deal_price: 999, discount_type: 'combo', is_active: true },
  { title: 'Student Special', description: 'Spicy Flare Burger + Masala Fries + Soft Drink — the perfect solo meal', image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800', original_price: 720, deal_price: 549, discount_type: 'combo', is_active: true },
  { title: 'Biryani Box', description: 'Flare Special Biryani + Raita + Soft Drink — a complete biryani meal', image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800', original_price: 730, deal_price: 580, discount_type: 'combo', is_active: true },
  { title: 'Karahi Night', description: 'Chicken Karahi + Zeera Rice (x2) + Naan (x4) — share the warmth', image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', original_price: 1490, deal_price: 1149, discount_type: 'combo', is_active: true },
];

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get('force') === 'true';

  try {
    await ensureSchema();

    const existing = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(existing.rows[0].count) > 0 && !force) {
      return NextResponse.json({
        ok: true,
        message: 'Database already seeded. Add ?force=true to re-seed.',
        categories: parseInt(existing.rows[0].count),
      });
    }

    await pool.query('BEGIN');

    if (force) {
      await pool.query('DELETE FROM orders');
      await pool.query('DELETE FROM menu_items');
      await pool.query('DELETE FROM deals');
      await pool.query('DELETE FROM categories');
    }

    // Insert categories
    const catIdMap = new Map<string, number>();
    for (const c of CATEGORIES) {
      const res = await pool.query(
        `INSERT INTO categories (name, slug, description, image_url, sort_order)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, sort_order=EXCLUDED.sort_order
         RETURNING id`,
        [c.name, c.slug, c.description, c.image_url, c.sort_order]
      );
      catIdMap.set(c.slug, res.rows[0].id);
    }

    // Insert menu items
    for (const item of MENU_ITEMS) {
      const catId = catIdMap.get(item.cat);
      await pool.query(
        `INSERT INTO menu_items
           (name, slug, description, category_id, price, original_price, image_url,
            is_available, is_featured, calories, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (slug) DO UPDATE SET
           price=EXCLUDED.price, is_featured=EXCLUDED.is_featured,
           image_url=EXCLUDED.image_url`,
        [item.name, item.slug, item.description, catId,
         item.price, item.original_price, item.image_url,
         item.is_available, item.is_featured, item.calories,
         item.tags]
      );
    }

    // Insert deals
    for (const d of DEALS) {
      await pool.query(
        `INSERT INTO deals (title, description, image_url, original_price, deal_price, discount_type, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT DO NOTHING`,
        [d.title, d.description, d.image_url, d.original_price, d.deal_price, d.discount_type, d.is_active]
      );
    }

    await pool.query('COMMIT');

    return NextResponse.json({
      ok: true,
      message: 'Database seeded successfully',
      categories: CATEGORIES.length,
      menuItems: MENU_ITEMS.length,
      deals: DEALS.length,
    });
  } catch (e) {
    await pool.query('ROLLBACK').catch(() => {});
    console.error('Setup error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await ensureSchema();
    const cats = await pool.query('SELECT COUNT(*) FROM categories');
    const items = await pool.query('SELECT COUNT(*) FROM menu_items');
    const deals = await pool.query('SELECT COUNT(*) FROM deals');
    const orders = await pool.query('SELECT COUNT(*) FROM orders');
    return NextResponse.json({
      ok: true,
      counts: {
        categories: parseInt(cats.rows[0].count),
        menuItems: parseInt(items.rows[0].count),
        deals: parseInt(deals.rows[0].count),
        orders: parseInt(orders.rows[0].count),
      },
      hint: 'POST to this URL with ?key=ADMIN_PASSWORD to seed data. Add &force=true to re-seed.',
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
