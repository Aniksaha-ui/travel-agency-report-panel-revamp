const sharedSvgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

function DashboardIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 4h6v8h-6z" />
      <path d="M14 4h6v5h-6z" />
      <path d="M14 13h6v7h-6z" />
      <path d="M4 16h6v5h-6z" />
    </svg>
  );
}

function UserManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

function RouteManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 4l4 0l0 4" />
      <path d="M4 20l0 -4l4 0" />
      <path d="M20 8c-1.333 -2.667 -3.333 -4 -6 -4c-4 0 -6 3 -8 7s-4 7 -8 7" />
    </svg>
  );
}

function VehicleManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 13l1 -3h13l3 3v5h-2a2 2 0 0 1 -4 0h-4a2 2 0 0 1 -4 0h-2z" />
      <path d="M5 10l1.5 -4h9l1.5 4" />
    </svg>
  );
}

function SeatManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 11h12" />
      <path d="M8 11v6" />
      <path d="M16 11v6" />
      <path d="M7 17h10" />
      <path d="M7 11v-3a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function TripManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M10 10l-7 -7" />
      <path d="M14 10l7 -7" />
      <path d="M12 21v-11" />
      <path d="M9 21h6" />
      <path d="M10 10h4" />
    </svg>
  );
}

function PackageManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9z" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12v9" />
      <path d="M12 12l-8 -4.5" />
    </svg>
  );
}

function MoneyIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 8a3 3 0 1 0 -3 -3" />
      <path d="M6 21a6 6 0 0 0 12 0v-1a6 6 0 1 0 -12 0v1z" />
      <path d="M6 10h12" />
    </svg>
  );
}

function ComplaintIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
      <path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1 -2 2h-4l-3 3l-3 -3h-4a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
    </svg>
  );
}

function GuideManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function BookingManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 7h16" />
      <path d="M7 4v6" />
      <path d="M17 4v6" />
      <path d="M5 11h14a2 2 0 0 1 2 2v5a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-5a2 2 0 0 1 2 -2" />
    </svg>
  );
}

function RefundManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 14l-4 -4l4 -4" />
      <path d="M5 10h7a4 4 0 0 1 4 4v1" />
      <path d="M15 18l4 -4l-4 -4" />
      <path d="M19 14h-7a4 4 0 0 0 -4 4v1" />
    </svg>
  );
}

function HotelManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 21l18 0" />
      <path d="M5 21v-14l7 -4l7 4v14" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

function HotelCheckInIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 21l18 0" />
      <path d="M5 17v-10h14v10" />
      <path d="M9 11l2 2l4 -4" />
    </svg>
  );
}

function ReportManagementIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 20l9 -5l-9 -5l-9 5z" />
      <path d="M12 12l9 -5l-9 -5l-9 5z" />
      <path d="M12 12v8" />
    </svg>
  );
}

function SqlMonitorIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...sharedSvgProps}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3c-4.418 0 -8 1.343 -8 3s3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3z" />
      <path d="M4 6v6c0 1.657 3.582 3 8 3c1.265 0 2.461 -.11 3.5 -.307" />
      <path d="M20 12v-6" />
      <path d="M4 12v6c0 1.657 3.582 3 8 3" />
      <path d="M19 19l2 2" />
      <path d="M17 14a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
    </svg>
  );
}

const iconMap = {
  DashboardIcon,
  UserManagementIcon,
  RouteManagementIcon,
  VehicleManagementIcon,
  SeatManagementIcon,
  TripManagementIcon,
  PackageManagementIcon,
  MoneyIcon,
  ComplaintIcon,
  GuideManagementIcon,
  BookingManagementIcon,
  RefundManagementIcon,
  HotelManagementIcon,
  HotelCheckInIcon,
  ReportManagementIcon,
  SqlMonitorIcon,
};

export function MenuIcon({ name, size = 20 }) {
  const IconComponent = iconMap[name] ?? PackageManagementIcon;

  return <IconComponent size={size} />;
}
