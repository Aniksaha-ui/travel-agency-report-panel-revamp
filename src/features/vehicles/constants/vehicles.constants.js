export const VEHICLES_COPY = {
  pageTitle: "Vehicles",
  pageSubtitle:
    "Monitor the admin vehicle catalog with route assignments, seat capacity, and searchable vehicle types.",
};

export const VEHICLES_FALLBACK_RESPONSE = {
  isExecture: "success",
  data: {
    current_page: 1,
    data: [
      {
        id: 1,
        vehicle_type: "bus",
        vehicle_name: "Golden Line",
        total_seats: 30,
        route_name: "Dhaka-Cox's Bazer",
      },
      {
        id: 2,
        vehicle_type: "bus",
        vehicle_name: "Golden Line #1231",
        total_seats: 30,
        route_name: "Dhaka-Cox's Bazer",
      },
    ],
    first_page_url: "http://127.0.0.1:8000/api/admin/vehicles?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "http://127.0.0.1:8000/api/admin/vehicles?page=1",
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/admin/vehicles",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
  message: "success",
};
