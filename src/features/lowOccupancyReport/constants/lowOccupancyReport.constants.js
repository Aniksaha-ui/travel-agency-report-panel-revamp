export const LOW_OCCUPANCY_REPORT_COPY = {
  pageTitle: "Low occupancy report",
  pageSubtitle: "Monitor trips with the lowest seat utilization before departure.",
};

export const LOW_OCCUPANCY_REPORT_FALLBACK_RESPONSE = {
  data: [
    {
      trip_name: "Explore New Zealand Beauty",
      departure_time: "2026-05-07 00:00:00",
      total_seats: "50",
      booked_seats: "0",
      occupancy_rate: "0.00",
    },
    {
      trip_name: "Explore Coxs Bazer",
      departure_time: "2026-05-07 00:00:00",
      total_seats: "50",
      booked_seats: "1",
      occupancy_rate: "2.00",
    },
    {
      trip_name: "Bankok trip",
      departure_time: "2026-05-08 00:00:00",
      total_seats: "50",
      booked_seats: "1",
      occupancy_rate: "2.00",
    },
  ],
  isExecute: "SUCCESS",
  message: "Report fetch successfully",
};
