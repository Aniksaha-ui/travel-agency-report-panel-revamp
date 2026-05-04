export const ROUTES_COPY = {
  pageTitle: "Routes",
  pageSubtitle:
    "Track trip corridors, origins, destinations, and route availability from the admin route catalog.",
};

export const ROUTES_FALLBACK_RESPONSE = {
  isExecture: "success",
  data: {
    current_page: 1,
    data: [
      {
        id: 9,
        origin: "Asia",
        destination: "Thailand",
        route_name: "Dhaka-Bangkok",
        created_at: null,
        updated_at: null,
      },
      {
        id: 8,
        origin: "Amarica",
        destination: "USA",
        route_name: "Dhaka-USA",
        created_at: null,
        updated_at: null,
      },
      {
        id: 4,
        origin: "South Africa",
        destination: "South Africa",
        route_name: "Dhaka-SA",
        created_at: null,
        updated_at: null,
      },
      {
        id: 3,
        origin: "Europe",
        destination: "Belgium",
        route_name: "Dhaka-Belgium",
        created_at: null,
        updated_at: null,
      },
      {
        id: 2,
        origin: "Asia",
        destination: "Dhaka",
        route_name: "Cox's Bazer-Dhaka",
        created_at: null,
        updated_at: null,
      },
      {
        id: 1,
        origin: "Asia",
        destination: "Cox's Bazer",
        route_name: "Dhaka-Cox's Bazer",
        created_at: null,
        updated_at: null,
      },
    ],
    first_page_url: "http://127.0.0.1:8000/api/admin/routes?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "http://127.0.0.1:8000/api/admin/routes?page=1",
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/admin/routes",
    per_page: 10,
    prev_page_url: null,
    to: 6,
    total: 6,
  },
  message: "Route list retrieved successfully",
};

export const ROUTE_DETAIL_FALLBACK_RESPONSE = {
  isExecture: "success",
  data: {
    id: 1,
    origin: "Asia",
    destination: "Cox's Bazer",
    route_name: "Dhaka-Cox's Bazer",
    created_at: null,
    updated_at: null,
  },
  message: "Information Retrieved Successfully",
};
