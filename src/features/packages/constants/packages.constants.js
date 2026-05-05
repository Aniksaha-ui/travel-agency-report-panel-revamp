export const PACKAGES_COPY = {
  pageTitle: "Packages",
  pageSubtitle:
    "Manage curated travel packages, review trip coverage, and create package pricing with guide assignments.",
};

export const PACKAGES_FALLBACK_RESPONSE = {
  isExecture: "success",
  data: {
    current_page: 1,
    data: [
      {
        id: 1,
        name: "Grand Package to cox's bazer testing",
        description:
          "Experience the magic of Cox's Bazar, the world's longest unbroken 120+ km natural sandy sea beach in Bangladesh. Known for its roaring waves, breathtaking sunsets, and golden sands, it's a top tourist destination featuring relaxing, family-friendly spots like Kolatoli and Sugandha. Enjoy fresh seafood, beach jeep rides, and, nearby, the scenic Himchari waterfalls.",
        trip_id: 1,
        includes_meal: 1,
        includes_hotel: 1,
        includes_bus: 1,
        image: "images/trips/default.png",
        created_at: "2026-02-14 21:26:00",
        updated_at: "2026-02-14 21:26:00",
        trip_name: "Grand trip Cox's Bazer - Batch 1",
      },
      {
        id: 2,
        name: "Grand Package to cox's bazer (23 Feb)",
        description:
          "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
        trip_id: 8,
        includes_meal: 1,
        includes_hotel: 1,
        includes_bus: 1,
        image: "images/trips/default.png",
        created_at: "2026-02-20 16:35:44",
        updated_at: "2026-02-20 16:35:44",
        trip_name: "Grand trip Cox's Bazer #58492",
      },
    ],
    first_page_url: "http://127.0.0.1:8000/api/admin/packages?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "http://127.0.0.1:8000/api/admin/packages?page=1",
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/admin/packages",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
  message: "List of packages",
};

export const PACKAGE_DETAIL_FALLBACK_RESPONSE = {
  isExecture: "success",
  data: {
    id: 1,
    name: "Grand Package to cox's bazer testing",
    description:
      "Experience the magic of Cox's Bazar, the world's longest unbroken 120+ km natural sandy sea beach in Bangladesh. Known for its roaring waves, breathtaking sunsets, and golden sands, it's a top tourist destination featuring relaxing, family-friendly spots like Kolatoli and Sugandha. Enjoy fresh seafood, beach jeep rides, and, nearby, the scenic Himchari waterfalls.",
    trip_id: 1,
    includes_meal: 1,
    includes_hotel: 1,
    includes_bus: 1,
    image: "images/trips/default.png",
    created_at: "2026-02-14 21:26:00",
    updated_at: "2026-02-14 21:26:00",
    inclusions: ["Breakfast"],
    exclusions: ["Ride sharing"],
    pricing: [
      {
        adult_price: "15000.00",
        child_price: "10000.00",
      },
    ],
    trip: {
      trip_id: 1,
      route_id: 1,
      vehicle_id: 1,
      departure_time: "2026-02-15 00:00:00",
      arrival_time: "2026-02-15 00:00:00",
      departure_at: "12:00 PM",
      arrival_at: "11:00 PM",
      route_name: "Dhaka-Cox's Bazer",
    },
  },
  message: "success",
};
