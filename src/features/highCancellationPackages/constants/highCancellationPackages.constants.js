export const HIGH_CANCELLATION_PACKAGES_COPY = {
  pageTitle: "High cancellation packages",
  pageSubtitle: "Review packages with the highest cancellation rate from the report API.",
};

export const HIGH_CANCELLATION_PACKAGES_FALLBACK_RESPONSE = {
  data: [
    {
      package_name: "Complete Package of New Zealand Travel",
      total_bookings: "5",
      cancelled_count: "1",
      cancellation_rate: "20.0000",
    },
    {
      package_name: "Grand Package to cox's bazer (23 Feb)",
      total_bookings: "3",
      cancelled_count: "0",
      cancellation_rate: "0.0000",
    },
    {
      package_name: "Grand Package to cox's bazer testing",
      total_bookings: "2",
      cancelled_count: "0",
      cancellation_rate: "0.0000",
    },
  ],
  isExecute: "SUCCESS",
  message: "Report fetch successfully",
};
