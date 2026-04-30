export const MONTH_RUNNING_BALANCE_COPY = {
  pageTitle: "Monthly running balance",
  pageSubtitle: "Review monthly credits, debits, and how the account balance rolls forward over time.",
};

export const MONTH_RUNNING_BALANCE_FALLBACK_RESPONSE = {
  data: {
    current_page: 1,
    data: [
      {
        month: "February 2026",
        tx_count: "44",
        total_credit: "2804100",
        total_debit: "58400",
        opening_balance: 0,
        closing_balance: 2745700,
      },
      {
        month: "March 2026",
        tx_count: "19",
        total_credit: "266500",
        total_debit: "0",
        opening_balance: 2745700,
        closing_balance: 3012200,
      },
      {
        month: "April 2026",
        tx_count: "23",
        total_credit: "4040500",
        total_debit: "585000",
        opening_balance: 3012200,
        closing_balance: 6467700,
      },
    ],
    first_page_url: "https://travelbooking.infinitycodehubltd.com/public/api/admin/monthRunningBalance?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "https://travelbooking.infinitycodehubltd.com/public/api/admin/monthRunningBalance?page=1",
    next_page_url: null,
    path: "https://travelbooking.infinitycodehubltd.com/public/api/admin/monthRunningBalance",
    per_page: 10,
    prev_page_url: null,
    to: 3,
    total: 3,
  },
  status: true,
  message: "Report retrieved successfully",
};
