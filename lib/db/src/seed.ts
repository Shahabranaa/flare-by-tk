import { db } from "./index";
import { categoriesTable, menuItemsTable, dealsTable } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(dealsTable);
  await db.delete(menuItemsTable);
  await db.delete(categoriesTable);

  // Insert categories
  const categories = await db
    .insert(categoriesTable)
    .values([
      {
        name: "Burgers",
        slug: "burgers",
        description: "Juicy flame-grilled burgers with premium toppings",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Grills & BBQ",
        slug: "grills-bbq",
        description: "Fire-grilled meats and sizzling BBQ platters",
        imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "Karahi & Curry",
        slug: "karahi-curry",
        description: "Rich, aromatic Pakistani karahi dishes",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
        sortOrder: 3,
        isActive: true,
      },
      {
        name: "Rice & Biryani",
        slug: "rice-biryani",
        description: "Fragrant basmati rice and layered biryani",
        imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
        sortOrder: 4,
        isActive: true,
      },
      {
        name: "Wraps & Rolls",
        slug: "wraps-rolls",
        description: "Loaded wraps and paratha rolls",
        imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400",
        sortOrder: 5,
        isActive: true,
      },
      {
        name: "Sides & Extras",
        slug: "sides-extras",
        description: "Fries, dips, and all the good extras",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
        sortOrder: 6,
        isActive: true,
      },
      {
        name: "Drinks",
        slug: "drinks",
        description: "Cold beverages and refreshing drinks",
        imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
        sortOrder: 7,
        isActive: true,
      },
    ])
    .returning();

  const catMap = new Map(categories.map((c) => [c.slug, c.id]));
  console.log(`Inserted ${categories.length} categories`);

  // Insert menu items
  const menuItems = await db
    .insert(menuItemsTable)
    .values([
      // Burgers
      {
        name: "Flare Classic Burger",
        slug: "flare-classic-burger",
        description: "Quarter-pound flame-grilled beef patty, fresh lettuce, tomato, onion, pickles and our signature Flare sauce",
        categoryId: catMap.get("burgers")!,
        price: "450",
        originalPrice: "550",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 580,
        tags: ["bestseller", "beef"],
      },
      {
        name: "Spicy Flare Burger",
        slug: "spicy-flare-burger",
        description: "Crispy fried chicken fillet with jalapeños, spicy mayo, coleslaw and pickled chilies",
        categoryId: catMap.get("burgers")!,
        price: "420",
        imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 620,
        tags: ["spicy", "chicken"],
      },
      {
        name: "Double Smash Burger",
        slug: "double-smash-burger",
        description: "Two smashed beef patties, American cheese, caramelized onions, secret sauce on brioche bun",
        categoryId: catMap.get("burgers")!,
        price: "650",
        imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 840,
        tags: ["beef", "premium"],
      },
      {
        name: "Zinger Tower Burger",
        slug: "zinger-tower-burger",
        description: "Tall stack with crispy zinger chicken, cheese slice, hash brown, lettuce and chipotle mayo",
        categoryId: catMap.get("burgers")!,
        price: "520",
        imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 720,
        tags: ["chicken", "popular"],
      },

      // Grills & BBQ
      {
        name: "Flare Mixed Grill Platter",
        slug: "flare-mixed-grill-platter",
        description: "Seekh kebab, boti, tikka and chargha wings served sizzling with naan and chutney",
        categoryId: catMap.get("grills-bbq")!,
        price: "1200",
        imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 1100,
        tags: ["sharing", "premium", "bestseller"],
      },
      {
        name: "Beef Seekh Kebab (6 pcs)",
        slug: "beef-seekh-kebab",
        description: "Hand-minced beef seekh kebab with herbs and spices, grilled over open flame",
        categoryId: catMap.get("grills-bbq")!,
        price: "550",
        imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 480,
        tags: ["beef", "traditional"],
      },
      {
        name: "Chicken Tikka (4 pcs)",
        slug: "chicken-tikka",
        description: "Marinated chicken tikka grilled to perfection, served with raita and green chutney",
        categoryId: catMap.get("grills-bbq")!,
        price: "620",
        imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 520,
        tags: ["chicken", "popular"],
      },
      {
        name: "Sizzling Beef Boti",
        slug: "sizzling-beef-boti",
        description: "Tender beef boti slow-marinated and grilled, served on sizzling cast iron",
        categoryId: catMap.get("grills-bbq")!,
        price: "750",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 620,
        tags: ["beef"],
      },

      // Karahi & Curry
      {
        name: "Chicken Karahi",
        slug: "chicken-karahi",
        description: "Wok-cooked chicken karahi with tomatoes, ginger, green chilies and fragrant spices",
        categoryId: catMap.get("karahi-curry")!,
        price: "950",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 780,
        tags: ["chicken", "traditional", "sharing"],
      },
      {
        name: "Beef Karahi",
        slug: "beef-karahi",
        description: "Rich slow-cooked beef karahi, dry-style with charred tomatoes and aromatic spices",
        categoryId: catMap.get("karahi-curry")!,
        price: "1100",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 920,
        tags: ["beef", "traditional"],
      },
      {
        name: "Mutton Handi",
        slug: "mutton-handi",
        description: "Slow-cooked mutton handi with cream, mild spices and saffron",
        categoryId: catMap.get("karahi-curry")!,
        price: "1350",
        imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 1050,
        tags: ["mutton", "premium"],
      },

      // Rice & Biryani
      {
        name: "Flare Special Biryani",
        slug: "flare-special-biryani",
        description: "Aromatic dum biryani with tender chicken, saffron, fried onions and mint",
        categoryId: catMap.get("rice-biryani")!,
        price: "450",
        imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 680,
        tags: ["chicken", "popular", "bestseller"],
      },
      {
        name: "Beef Biryani",
        slug: "beef-biryani",
        description: "Slow-dum beef biryani with caramelized onions, whole spices and kewra water",
        categoryId: catMap.get("rice-biryani")!,
        price: "520",
        imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 730,
        tags: ["beef"],
      },
      {
        name: "Zeera Rice",
        slug: "zeera-rice",
        description: "Fluffy basmati rice tempered with cumin, ghee and whole spices",
        categoryId: catMap.get("rice-biryani")!,
        price: "180",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff86e0c9db82?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 320,
        tags: ["vegetarian", "side"],
      },

      // Wraps & Rolls
      {
        name: "Chicken Paratha Roll",
        slug: "chicken-paratha-roll",
        description: "Flaky paratha wrapped around spiced chicken tikka, onions and chutneys",
        categoryId: catMap.get("wraps-rolls")!,
        price: "280",
        imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 420,
        tags: ["chicken", "popular"],
      },
      {
        name: "Beef Chapli Wrap",
        slug: "beef-chapli-wrap",
        description: "Crispy chapli kebab, tomato, onion, raita and mint chutney in a paratha",
        categoryId: catMap.get("wraps-rolls")!,
        price: "320",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 480,
        tags: ["beef"],
      },

      // Sides
      {
        name: "Masala Fries",
        slug: "masala-fries",
        description: "Crispy golden fries tossed in our signature masala seasoning",
        categoryId: catMap.get("sides-extras")!,
        price: "220",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 380,
        tags: ["vegetarian", "popular"],
      },
      {
        name: "Coleslaw",
        slug: "coleslaw",
        description: "Creamy homemade coleslaw with cabbage, carrots and special dressing",
        categoryId: catMap.get("sides-extras")!,
        price: "120",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 180,
        tags: ["vegetarian"],
      },
      {
        name: "Raita",
        slug: "raita",
        description: "Fresh yogurt raita with cucumber, mint and a dash of chaat masala",
        categoryId: catMap.get("sides-extras")!,
        price: "80",
        imageUrl: "https://images.unsplash.com/photo-1631452180539-c9fa6c5c13a3?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 90,
        tags: ["vegetarian"],
      },

      // Drinks
      {
        name: "Rooh Afza Lemonade",
        slug: "rooh-afza-lemonade",
        description: "Refreshing lemonade with Rooh Afza rose syrup and fresh mint",
        categoryId: catMap.get("drinks")!,
        price: "180",
        imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600",
        isAvailable: true,
        isFeatured: true,
        calories: 145,
        tags: ["cold", "popular"],
      },
      {
        name: "Mango Lassi",
        slug: "mango-lassi",
        description: "Thick chilled mango lassi with Chaunsa mangoes and cardamom",
        categoryId: catMap.get("drinks")!,
        price: "200",
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 280,
        tags: ["cold", "seasonal"],
      },
      {
        name: "Soft Drink (330ml)",
        slug: "soft-drink",
        description: "Pepsi, 7UP, Mirinda or Mountain Dew — your choice",
        categoryId: catMap.get("drinks")!,
        price: "100",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600",
        isAvailable: true,
        isFeatured: false,
        calories: 140,
        tags: ["cold"],
      },
    ])
    .returning();

  console.log(`Inserted ${menuItems.length} menu items`);

  // Insert deals
  const deals = await db
    .insert(dealsTable)
    .values([
      {
        title: "Family Grill Feast",
        slug: "family-grill-feast",
        description: "Mixed Grill Platter + Flare Special Biryani (x2) + Masala Fries + 4 Soft Drinks. Perfect for a family of 4.",
        imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800",
        discountType: "combo",
        originalPrice: "2100",
        dealPrice: "1599",
        isActive: true,
        sortOrder: 1,
      },
      {
        title: "Burger Duo Deal",
        slug: "burger-duo-deal",
        description: "2x Flare Classic Burgers + 2x Masala Fries + 2x Soft Drinks",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        discountType: "combo",
        originalPrice: "1340",
        dealPrice: "999",
        isActive: true,
        sortOrder: 2,
      },
      {
        title: "Student Special",
        slug: "student-special",
        description: "Spicy Flare Burger + Masala Fries + Soft Drink — the perfect solo meal",
        imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800",
        discountType: "combo",
        originalPrice: "720",
        dealPrice: "549",
        isActive: true,
        sortOrder: 3,
      },
      {
        title: "Biryani Box",
        slug: "biryani-box",
        description: "Flare Special Biryani + Raita + Soft Drink — a complete biryani meal",
        imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800",
        discountType: "combo",
        originalPrice: "730",
        dealPrice: "580",
        isActive: true,
        sortOrder: 4,
      },
      {
        title: "Karahi Night",
        slug: "karahi-night",
        description: "Chicken Karahi + Zeera Rice (x2) + Naan (x4) — share the warmth",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        discountType: "combo",
        originalPrice: "1490",
        dealPrice: "1149",
        isActive: true,
        sortOrder: 5,
      },
    ])
    .returning();

  console.log(`Inserted ${deals.length} deals`);
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
