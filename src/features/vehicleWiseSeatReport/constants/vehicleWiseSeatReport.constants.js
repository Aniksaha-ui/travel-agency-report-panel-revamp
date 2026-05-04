export const VEHICLE_WISE_SEAT_REPORT_COPY = {
  pageTitle: "Vehicle wise total seat report",
  pageSubtitle: "Track available seat inventory by vehicle and vehicle type from the report API.",
};

export const VEHICLE_WISE_SEAT_REPORT_FALLBACK_RESPONSE = {
  data: {
    current_page: 1,
    data: [
      {
        vehicle_id: "1",
        vehicle_name: "Golden Line",
        vehicle_type: "bus",
        available_seats: "30",
      },
      {
        vehicle_id: "2",
        vehicle_name: "Golden Line #1231",
        vehicle_type: "bus",
        available_seats: "30",
      },
      {
        vehicle_id: "3",
        vehicle_name: "Nobo Air",
        vehicle_type: "flight",
        available_seats: "50",
      },
      {
        vehicle_id: "4",
        vehicle_name: "Nobo Air #coach 8960",
        vehicle_type: "flight",
        available_seats: "20",
      },
      {
        vehicle_id: "5",
        vehicle_name: "Thailand airlines",
        vehicle_type: "flight",
        available_seats: "25",
      },
      {
        vehicle_id: "6",
        vehicle_name: "Ruposi Bangla",
        vehicle_type: "train",
        available_seats: "45",
      },
      {
        vehicle_id: "7",
        vehicle_name: "Nobo Air (coach #new_zeland_103940)",
        vehicle_type: "flight",
        available_seats: "52",
      },
      {
        vehicle_id: "8",
        vehicle_name: "Novo Air (Netherland_104010034)",
        vehicle_type: "flight",
        available_seats: "50",
      },
    ],
    first_page_url: "https://travelbooking.infinitycodehubltd.com/public/api/admin/vehiclewisetotalseat?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "https://travelbooking.infinitycodehubltd.com/public/api/admin/vehiclewisetotalseat?page=1",
    next_page_url: null,
    path: "https://travelbooking.infinitycodehubltd.com/public/api/admin/vehiclewisetotalseat",
    per_page: 10,
    prev_page_url: null,
    to: 8,
    total: 8,
  },
  message: "success",
};
