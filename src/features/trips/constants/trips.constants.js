export const TRIPS_COPY = {
  pageTitle: "Trips",
  pageSubtitle:
    "Review scheduled trips, routes, vehicles, and fares with quick filters for origin, destination, and route name.",
};

export const TRIPS_FALLBACK_RESPONSE = {
  isExecture: "success",
  data: {
    current_page: 1,
    data: [
      {
        id: 14,
        trip_name: "Explore Bangkok",
        departure_time: "2026-04-07 00:00:00",
        arrival_time: "2026-04-15 00:00:00",
        price: "30000.00",
        vehicle_name: "Nobo Air",
        route_name: "Dhaka-Bangkok",
        is_active: 0,
      },
      {
        id: 13,
        trip_name: "Cox's Bazar Escape",
        departure_time: "2026-03-30 00:00:00",
        arrival_time: "2026-03-31 00:00:00",
        price: "1200.00",
        vehicle_name: "Golden Line",
        route_name: "Dhaka-Cox's Bazar",
        is_active: 1,
      },
      {
        id: 12,
        trip_name: "Sylhet Tea Valley Tour",
        departure_time: "2026-03-28 06:30:00",
        arrival_time: "2026-03-28 13:30:00",
        price: "1800.00",
        vehicle_name: "Green Saintmartin",
        route_name: "Dhaka-Sylhet",
        is_active: 1,
      },
    ],
    first_page_url: "http://127.0.0.1:8000/api/admin/trip?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "http://127.0.0.1:8000/api/admin/trip?page=1",
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/admin/trip",
    per_page: 10,
    prev_page_url: null,
    to: 3,
    total: 3,
  },
  message: "success",
};
