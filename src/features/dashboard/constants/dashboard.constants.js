export const DASHBOARD_COPY = {
  pageTitle: "Datatables",
  pageSubtitle: "",
};

export const DASHBOARD_METRICS = [
  { id: "revenue", label: "Monthly revenue", value: "$128,400", change: "+12.4%", changeTone: "success" },
  { id: "bookings", label: "Active bookings", value: "284", change: "+31 today", changeTone: "info" },
  { id: "pending", label: "Pending approvals", value: "19", change: "Needs review", changeTone: "warning" },
  { id: "cancellations", label: "Cancellations", value: "6", change: "-2 vs last week", changeTone: "danger" },
];

export const RECENT_BOOKINGS = [
  {
    id: "BK-1042",
    traveler: "Nafisa Karim",
    destination: "Bali Escape",
    departureDate: "2026-05-14",
    amount: "$4,280",
    agent: "M. Hossain",
    status: "confirmed",
  },
  {
    id: "BK-1043",
    traveler: "Adnan Kabir",
    destination: "Dubai Stopover",
    departureDate: "2026-05-18",
    amount: "$2,110",
    agent: "S. Ahmed",
    status: "pending",
  },
  {
    id: "BK-1044",
    traveler: "Farzana Ali",
    destination: "Singapore City Pass",
    departureDate: "2026-05-22",
    amount: "$3,560",
    agent: "T. Islam",
    status: "awaiting-payment",
  },
  {
    id: "BK-1045",
    traveler: "Rafi Chowdhury",
    destination: "Bali Escape",
    departureDate: "2026-06-03",
    amount: "$5,040",
    agent: "M. Hossain",
    status: "confirmed",
  },
];
