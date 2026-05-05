import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import {
  HOTEL_DETAIL_FALLBACK_RESPONSE,
  HOTELS_COPY,
  HOTELS_FALLBACK_RESPONSE,
} from "../constants/hotels.constants";

const DEFAULT_HOTELS_PER_PAGE = 20;
const toNumber = (value) => Number(value) || 0;
const normalizeString = (value) => String(value ?? "").trim();
const normalizeLowerString = (value) => normalizeString(value).toLowerCase();

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const isHotelActive = (value) => normalizeString(value) === "1";

const formatRatingLabel = (value) => {
  const rating = toNumber(value);

  return rating > 0 ? `${rating}/5 stars` : "Unrated";
};

const filterFallbackHotels = (payload, search) => {
  const normalizedValue = normalizeLowerString(search);
  const rows = payload?.data?.data ?? [];
  const filteredHotels = normalizedValue
    ? rows.filter((item) =>
        [item.name, item.email, item.city, item.country, item.location]
          .some((fieldValue) => String(fieldValue ?? "").toLowerCase().includes(normalizedValue))
      )
    : rows;

  return {
    ...payload,
    data: {
      ...payload.data,
      data: filteredHotels,
      total: filteredHotels.length,
      from: filteredHotels.length ? 1 : 0,
      to: filteredHotels.length,
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
  };
};

const normalizeHotelPrices = (prices = [], fallbackTypeName = "") =>
  prices.map((price) => {
    const pricePerNight = toNumber(price.price_per_night);

    return {
      id: normalizeString(price.id),
      hotelRoomId: normalizeString(price.hotel_room_id),
      seasonStart: normalizeString(price.season_start),
      seasonEnd: normalizeString(price.season_end),
      pricePerNight: normalizeString(price.price_per_night),
      pricePerNightValue: pricePerNight,
      pricePerNightLabel: formatCurrency(pricePerNight),
      typeName: normalizeString(price.type_name) || fallbackTypeName,
      createdAtLabel: formatDateTime(price.created_at),
      updatedAtLabel: formatDateTime(price.updated_at),
    };
  });

const normalizeHotelRooms = (rooms = []) =>
  rooms.map((room, roomIndex) => {
    const typeName = normalizeString(room.type_name || room.prices?.[0]?.type_name);
    const prices = normalizeHotelPrices(room.prices, typeName);
    const totalRooms = toNumber(room.total_rooms);
    const maxOccupancy = toNumber(room.max_occupancy);

    return {
      id: normalizeString(room.room_id) || `room-${roomIndex + 1}`,
      roomId: normalizeString(room.room_id),
      typeName: typeName || "Untitled room type",
      roomSize: normalizeString(room.room_size),
      maxOccupancy,
      maxOccupancyLabel: formatNumber(maxOccupancy),
      amenities: normalizeString(room.amenities),
      totalRooms,
      totalRoomsLabel: formatNumber(totalRooms),
      prices,
    };
  });

const createEmptyPrice = () => ({
  id: "",
  hotelRoomId: "",
  seasonStart: "",
  seasonEnd: "",
  pricePerNight: "",
});

export const createEmptyHotelPrice = createEmptyPrice;

export const createEmptyHotelRoom = () => ({
  roomId: "",
  typeName: "",
  roomSize: "",
  maxOccupancy: "",
  amenities: "",
  totalRooms: "",
  prices: [createEmptyPrice()],
});

export const normalizeHotels = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const hotels = rows.map((item) => {
    const starRating = toNumber(item.star_rating);
    const isActive = isHotelActive(item.status);

    return {
      id: item.id,
      hotelId: item.id,
      name: item.name ?? "Unnamed hotel",
      email: item.email ?? "No email",
      website: item.website ?? "",
      location: item.location ?? "Unknown location",
      starRating,
      starRatingLabel: formatRatingLabel(starRating),
      city: item.city ?? "Unknown city",
      country: item.country ?? "Unknown country",
      address: item.address ?? "",
      description: item.description ?? "",
      facilities: item.facilities ?? "",
      status: normalizeString(item.status),
      isActive,
      statusLabel: isActive ? "Active" : "Inactive",
      createdAtLabel: formatDateTime(item.created_at),
      updatedAtLabel: formatDateTime(item.updated_at),
    };
  });

  const activeHotels = hotels.filter((hotel) => hotel.isActive).length;
  const totalStars = hotels.reduce((sum, hotel) => sum + hotel.starRating, 0);
  const averageRating = hotels.length ? totalStars / hotels.length : 0;
  const spotlightHotel =
    [...hotels].sort((first, second) => second.starRating - first.starRating)[0] ?? null;

  return {
    copy: HOTELS_COPY,
    metrics: [
      {
        id: "total-hotels",
        label: "Total hotels",
        value: formatNumber(source.total ?? hotels.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visible-hotels",
        label: "Visible hotels",
        value: formatNumber(hotels.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "active-hotels",
        label: "Active hotels",
        value: formatNumber(activeHotels),
        change: `${formatNumber(hotels.length - activeHotels)} inactive on this page`,
        changeTone: "warning",
      },
      {
        id: "average-rating",
        label: "Average rating",
        value: averageRating ? averageRating.toFixed(1) : "0.0",
        change: spotlightHotel?.name ?? "No hotel data available",
        changeTone: "danger",
      },
    ],
    hotels,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total),
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      activeHotels,
      activeHotelsLabel: formatNumber(activeHotels),
      averageRating,
      averageRatingLabel: averageRating ? averageRating.toFixed(1) : "0.0",
      spotlightHotel,
    },
  };
};

export const normalizeHotelDetails = (payload) => {
  const source = payload?.data?.hotel ?? {};
  const starRating = toNumber(source.star_rating);
  const photos = Array.isArray(source.photos) ? source.photos.filter(Boolean) : [];
  const rooms = normalizeHotelRooms(source.rooms);
  const seasonalPrices = rooms.flatMap((room) => room.prices);
  const priceRangeValues = seasonalPrices.map((price) => price.pricePerNightValue).filter(Boolean);
  const minimumPrice = priceRangeValues.length ? Math.min(...priceRangeValues) : 0;

  return {
    hotelId: source.id,
    name: source.name ?? "Unnamed hotel",
    email: source.email ?? "",
    city: source.city ?? "",
    website: source.website ?? "",
    description: source.description ?? "",
    location: source.location ?? "",
    starRating,
    starRatingLabel: formatRatingLabel(starRating),
    facilities: source.facilities ?? "",
    photos,
    rooms,
    roomCountLabel: formatNumber(rooms.length),
    photoCountLabel: formatNumber(photos.length),
    minimumPriceLabel: minimumPrice ? formatCurrency(minimumPrice) : "No seasonal pricing",
  };
};

export const normalizeHotelFormState = (hotelDetails = {}, hotelSummary = {}) => ({
  name: hotelDetails.name ?? hotelSummary.name ?? "",
  email: hotelDetails.email ?? hotelSummary.email ?? "",
  city: hotelDetails.city ?? hotelSummary.city ?? "",
  website: hotelDetails.website ?? hotelSummary.website ?? "",
  description: hotelDetails.description ?? hotelSummary.description ?? "",
  location: hotelDetails.location ?? hotelSummary.location ?? "",
  starRating: String(hotelDetails.starRating ?? hotelSummary.starRating ?? 0),
  facilities: hotelDetails.facilities ?? hotelSummary.facilities ?? "",
  country: hotelSummary.country ?? "",
  status: hotelSummary.status || "0",
  photos: hotelDetails.photos?.length ? hotelDetails.photos : [""],
  rooms:
    hotelDetails.rooms?.length
      ? hotelDetails.rooms.map((room) => ({
          roomId: room.roomId ?? "",
          typeName: room.typeName ?? "",
          roomSize: room.roomSize ?? "",
          maxOccupancy: String(room.maxOccupancy ?? ""),
          amenities: room.amenities ?? "",
          totalRooms: String(room.totalRooms ?? ""),
          prices:
            room.prices?.length
              ? room.prices.map((price) => ({
                  id: price.id ?? "",
                  hotelRoomId: price.hotelRoomId ?? "",
                  seasonStart: price.seasonStart ?? "",
                  seasonEnd: price.seasonEnd ?? "",
                  pricePerNight: price.pricePerNight ?? "",
                }))
              : [createEmptyPrice()],
        }))
      : [createEmptyHotelRoom()],
});

const buildHotelPayload = (values) => ({
  name: normalizeString(values.name),
  location: normalizeString(values.location),
  star_rating: toNumber(values.starRating),
  description: normalizeString(values.description),
  city: normalizeString(values.city),
  country: normalizeString(values.country),
  website: normalizeString(values.website),
  email: normalizeString(values.email),
  facilities: normalizeString(values.facilities),
  status: normalizeString(values.status || "0"),
  photos: (values.photos ?? []).map(normalizeString).filter(Boolean),
  rooms: (values.rooms ?? []).map((room) => {
    const normalizedRoom = {
      type_name: normalizeString(room.typeName),
      room_size: normalizeString(room.roomSize),
      max_occupancy: toNumber(room.maxOccupancy),
      amenities: normalizeString(room.amenities),
      total_rooms: toNumber(room.totalRooms),
      prices: (room.prices ?? []).map((price) => ({
        season_start: normalizeString(price.seasonStart),
        season_end: normalizeString(price.seasonEnd),
        price_per_night: normalizeString(price.pricePerNight),
        type_name: normalizeString(room.typeName),
      })),
    };

    if (normalizeString(room.roomId)) {
      normalizedRoom.room_id = normalizeString(room.roomId);
    }

    return normalizedRoom;
  }),
});

const appendFormDataValue = (formData, key, value) => {
  formData.append(key, value == null ? "" : String(value));
};

const appendHotelFormData = (formData, hotelId, values) => {
  appendFormDataValue(formData, "id", hotelId);
  appendFormDataValue(formData, "name", normalizeString(values.name));
  appendFormDataValue(formData, "email", normalizeString(values.email));
  appendFormDataValue(formData, "city", normalizeString(values.city));
  appendFormDataValue(formData, "country", normalizeString(values.country));
  appendFormDataValue(formData, "website", normalizeString(values.website));
  appendFormDataValue(formData, "description", normalizeString(values.description));
  appendFormDataValue(formData, "location", normalizeString(values.location));
  appendFormDataValue(formData, "star_rating", normalizeString(values.starRating));
  appendFormDataValue(formData, "facilities", normalizeString(values.facilities));
  appendFormDataValue(formData, "status", normalizeString(values.status || "0"));

  (values.photos ?? [])
    .map(normalizeString)
    .filter(Boolean)
    .forEach((photo, index) => {
      appendFormDataValue(formData, `photos[${index}]`, photo);
    });

  (values.rooms ?? []).forEach((room, roomIndex) => {
    const roomPrefix = `rooms[${roomIndex}]`;

    if (normalizeString(room.roomId)) {
      appendFormDataValue(formData, `${roomPrefix}[room_id]`, room.roomId);
    }

    appendFormDataValue(formData, `${roomPrefix}[type_name]`, normalizeString(room.typeName));
    appendFormDataValue(formData, `${roomPrefix}[room_size]`, normalizeString(room.roomSize));
    appendFormDataValue(formData, `${roomPrefix}[max_occupancy]`, normalizeString(room.maxOccupancy));
    appendFormDataValue(formData, `${roomPrefix}[amenities]`, normalizeString(room.amenities));
    appendFormDataValue(formData, `${roomPrefix}[total_rooms]`, normalizeString(room.totalRooms));

    (room.prices ?? []).forEach((price, priceIndex) => {
      const pricePrefix = `${roomPrefix}[prices][${priceIndex}]`;

      if (normalizeString(price.id)) {
        appendFormDataValue(formData, `${pricePrefix}[id]`, price.id);
      }

      if (normalizeString(price.hotelRoomId)) {
        appendFormDataValue(formData, `${pricePrefix}[hotel_room_id]`, price.hotelRoomId);
      }

      appendFormDataValue(formData, `${pricePrefix}[season_start]`, normalizeString(price.seasonStart));
      appendFormDataValue(formData, `${pricePrefix}[season_end]`, normalizeString(price.seasonEnd));
      appendFormDataValue(formData, `${pricePrefix}[price_per_night]`, normalizeString(price.pricePerNight));
      appendFormDataValue(formData, `${pricePrefix}[type_name]`, normalizeString(room.typeName));
    });
  });
};

export const getHotels = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.hotels, {
        page,
        perPage: DEFAULT_HOTELS_PER_PAGE,
      })
    );

    if (response.data) {
      const normalizedResponse = normalizeHotels(response.data);

      if (!normalizeString(search)) {
        return normalizedResponse;
      }

      return normalizeHotels(filterFallbackHotels(response.data, search));
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeHotels(filterFallbackHotels(HOTELS_FALLBACK_RESPONSE, search));
};

export const getHotelDetails = async (hotelId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleHotel(hotelId));

    if (response.data?.data?.hotel) {
      return normalizeHotelDetails(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 200);
    });
  }

  return normalizeHotelDetails(HOTEL_DETAIL_FALLBACK_RESPONSE);
};

export const createHotel = async (values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.hotels, buildHotelPayload(values));

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to create the hotel right now.");
};

export const updateHotel = async (hotelId, values) => {
  const formData = new FormData();

  appendHotelFormData(formData, hotelId, values);

  try {
    const response = await apiClient.post(API_URLS.reports.hotelUpdate(hotelId), formData);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to update the hotel right now.");
};
