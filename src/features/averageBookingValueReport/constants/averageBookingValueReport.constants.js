export const AVERAGE_BOOKING_VALUE_REPORT_COPY = {
  pageTitle: "Average booking value report",
  pageSubtitle: "Compare the average value across booking categories returned by the report API.",
};

export const AVERAGE_BOOKING_VALUE_REPORT_FALLBACK_RESPONSE = {
  data: [
    {
      booking_type: "package",
      average_value: "215000.000000",
    },
    {
      booking_type: "trip",
      average_value: "80741.403509",
    },
    {
      booking_type: "hotel booking",
      average_value: "2825.000000",
    },
    {
      booking_type: "visa",
      average_value: "1500.000000",
    },
  ],
  isExecute: "SUCCESS",
  message: "Report fetch successfully",
};
