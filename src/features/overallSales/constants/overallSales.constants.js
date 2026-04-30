export const OVERALL_SALES_COPY = {
  pageTitle: "Overall sales report",
  pageSubtitle: "Compare total sales by source and route-wise revenue performance.",
};

export const OVERALL_SALES_FALLBACK_RESPONSE = {
  data: [
    {
      source: "Trip",
      total_amount: "4684660.00",
    },
    {
      source: "Package",
      total_amount: "2400000.00",
    },
    {
      source: "Hotel",
      total_amount: "22600.00",
    },
  ],
  isExecute: "SUCCESS",
  message: "Report fetch successfully",
};

export const ROUTE_WISE_SALES_FALLBACK_RESPONSE = {
  data: [
    {
      route_name: "Cox's Bazer-Dhaka",
      total_bookings: "5",
      total_revenue: "38200.00",
    },
    {
      route_name: "Dhaka-Bangkok",
      total_bookings: "5",
      total_revenue: "422000.00",
    },
    {
      route_name: "Dhaka-Belgium",
      total_bookings: "17",
      total_revenue: "1222000.00",
    },
    {
      route_name: "Dhaka-Cox's Bazer",
      total_bookings: "26",
      total_revenue: "451460.00",
    },
    {
      route_name: "Dhaka-New Zeland",
      total_bookings: "10",
      total_revenue: "3751000.00",
    },
    {
      route_name: "Dhaka-USA",
      total_bookings: "5",
      total_revenue: "1200000.00",
    },
  ],
  isExecute: "SUCCESS",
  message: "Report fetch successfully",
};
