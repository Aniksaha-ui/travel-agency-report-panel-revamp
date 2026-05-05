import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import InputField from "../../../components/forms/InputField";
import SelectField from "../../../components/forms/SelectField";
import Card from "../../../components/ui/Card";
import { APP_ROUTES } from "../../../constants/routes";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import {
  createEmptyHotelPrice,
  createEmptyHotelRoom,
  createHotel,
  getHotelDetails,
  normalizeHotelFormState,
  updateHotel,
} from "../services/hotelsService";

const INITIAL_FORM_STATE = normalizeHotelFormState();

const STATUS_OPTIONS = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

const STAR_OPTIONS = Array.from({ length: 6 }, (_, index) => ({
  value: String(index),
  label: index === 0 ? "Unrated" : `${index} star${index > 1 ? "s" : ""}`,
}));

const validateForm = (values) => {
  const errors = {};

  if (!String(values.name).trim()) {
    errors.name = "Hotel name is required.";
  }

  if (!String(values.email).trim()) {
    errors.email = "Hotel email is required.";
  }

  if (!String(values.location).trim()) {
    errors.location = "Hotel location is required.";
  }

  if (!String(values.city).trim()) {
    errors.city = "City is required.";
  }

  if (!String(values.country).trim()) {
    errors.country = "Country is required.";
  }

  return errors;
};

const getNestedValidationMessage = (values) => {
  const populatedPhotos = (values.photos ?? []).map((photo) => String(photo ?? "").trim()).filter(Boolean);

  if (!populatedPhotos.length) {
    return "Add at least one hotel photo URL before saving.";
  }

  if (!(values.rooms ?? []).length) {
    return "Add at least one room before saving the hotel.";
  }

  for (const [roomIndex, room] of (values.rooms ?? []).entries()) {
    if (!String(room.typeName).trim()) {
      return `Room ${roomIndex + 1}: type name is required.`;
    }

    if (!String(room.roomSize).trim()) {
      return `Room ${roomIndex + 1}: room size is required.`;
    }

    if (!String(room.maxOccupancy).trim()) {
      return `Room ${roomIndex + 1}: max occupancy is required.`;
    }

    if (!String(room.totalRooms).trim()) {
      return `Room ${roomIndex + 1}: total rooms is required.`;
    }

    if (!(room.prices ?? []).length) {
      return `Room ${roomIndex + 1}: add at least one seasonal price.`;
    }

    for (const [priceIndex, price] of room.prices.entries()) {
      if (!String(price.seasonStart).trim()) {
        return `Room ${roomIndex + 1}, price ${priceIndex + 1}: season start is required.`;
      }

      if (!String(price.seasonEnd).trim()) {
        return `Room ${roomIndex + 1}, price ${priceIndex + 1}: season end is required.`;
      }

      if (!String(price.pricePerNight).trim()) {
        return `Room ${roomIndex + 1}, price ${priceIndex + 1}: price per night is required.`;
      }
    }
  }

  return null;
};

export default function HotelFormPage() {
  const { hotelId = "" } = useParams();
  const isEditMode = Boolean(hotelId);
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hotelSummary = routerLocation.state?.hotel ?? null;
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: hotelDetails,
    isLoading: isHotelLoading,
    error: hotelError,
  } = useApi({
    queryKey: ["reports", "hotel-details", hotelId],
    queryFn: () => getHotelDetails(hotelId),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(INITIAL_FORM_STATE);
      setFormErrors({});
      return;
    }

    if (!hotelDetails) {
      return;
    }

    setFormValues(normalizeHotelFormState(hotelDetails, hotelSummary ?? {}));
    setFormErrors({});
  }, [hotelDetails, hotelSummary, isEditMode]);

  const hotelMutation = useMutation({
    mutationFn: (values) => (isEditMode ? updateHotel(hotelId, values) : createHotel(values)),
    onSuccess: (response) => {
      toast.success(
        response?.message || (isEditMode ? "Hotel updated successfully." : "Hotel created successfully.")
      );
      queryClient.invalidateQueries({ queryKey: ["reports", "hotels"] });

      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["reports", "hotel-details", hotelId] });
      }

      navigate(APP_ROUTES.hotel, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to save the hotel.");
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handlePhotoChange = (photoIndex, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      photos: currentValues.photos.map((photo, index) => (index === photoIndex ? nextValue : photo)),
    }));
  };

  const addPhoto = () => {
    setFormValues((currentValues) => ({
      ...currentValues,
      photos: [...currentValues.photos, ""],
    }));
  };

  const removePhoto = (photoIndex) => {
    setFormValues((currentValues) => {
      const nextPhotos = currentValues.photos.filter((_, index) => index !== photoIndex);

      return {
        ...currentValues,
        photos: nextPhotos.length ? nextPhotos : [""],
      };
    });
  };

  const handleRoomChange = (roomIndex, field, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      rooms: currentValues.rooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              [field]: nextValue,
            }
          : room
      ),
    }));
  };

  const addRoom = () => {
    setFormValues((currentValues) => ({
      ...currentValues,
      rooms: [...currentValues.rooms, createEmptyHotelRoom()],
    }));
  };

  const removeRoom = (roomIndex) => {
    setFormValues((currentValues) => {
      const nextRooms = currentValues.rooms.filter((_, index) => index !== roomIndex);

      return {
        ...currentValues,
        rooms: nextRooms.length ? nextRooms : [createEmptyHotelRoom()],
      };
    });
  };

  const handlePriceChange = (roomIndex, priceIndex, field, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      rooms: currentValues.rooms.map((room, currentRoomIndex) =>
        currentRoomIndex === roomIndex
          ? {
              ...room,
              prices: room.prices.map((price, currentPriceIndex) =>
                currentPriceIndex === priceIndex
                  ? {
                      ...price,
                      [field]: nextValue,
                    }
                  : price
              ),
            }
          : room
      ),
    }));
  };

  const addPrice = (roomIndex) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      rooms: currentValues.rooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              prices: [...room.prices, createEmptyHotelPrice()],
            }
          : room
      ),
    }));
  };

  const removePrice = (roomIndex, priceIndex) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      rooms: currentValues.rooms.map((room, index) => {
        if (index !== roomIndex) {
          return room;
        }

        const nextPrices = room.prices.filter((_, currentPriceIndex) => currentPriceIndex !== priceIndex);

        return {
          ...room,
          prices: nextPrices.length ? nextPrices : [createEmptyHotelPrice()],
        };
      }),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    const nestedValidationMessage = getNestedValidationMessage(formValues);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      toast.error("Please complete the required hotel fields before saving.");
      return;
    }

    if (nestedValidationMessage) {
      toast.error(nestedValidationMessage);
      return;
    }

    hotelMutation.mutate(formValues);
  };

  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {isEditMode ? `/admin/hotel/${hotelId}/edit` : "/admin/hotel/create"}
              </span>
              <h2 className="page-title">{isEditMode ? "Edit hotel" : "Create hotel"}</h2>
              <p className="text-secondary mb-0">
                Manage hotel profile details, photo links, room types, and seasonal room prices.
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Mode</span>
                <strong>{isEditMode ? "Update existing" : "Create new"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Hotel ID</span>
                <strong>{isEditMode ? `#${hotelId}` : "Draft"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-3">
            <div className="col-12 col-xl-8">
              <Card
                title="Hotel form"
                subtitle="This editor maps the hotel API payload into hotel details, photo URLs, room blocks, and nested seasonal prices."
                className="trip-performance-card border-0"
              >
                {isEditMode && isHotelLoading ? (
                  <div className="text-secondary">Loading hotel editor...</div>
                ) : isEditMode && hotelError ? (
                  <div className="text-danger">
                    {hotelError.message || "Unable to load hotel editing data."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <InputField
                        className="col-12 col-md-6"
                        label="Hotel name"
                        name="name"
                        placeholder="Sea place hotel"
                        value={formValues.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Email"
                        name="email"
                        placeholder="hotel@example.com"
                        value={formValues.email}
                        onChange={handleInputChange}
                        error={formErrors.email}
                      />

                      <InputField
                        className="col-12 col-md-6"
                        label="Website"
                        name="website"
                        placeholder="www.example.com"
                        value={formValues.website}
                        onChange={handleInputChange}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Location"
                        name="location"
                        placeholder="Cox's Bazar"
                        value={formValues.location}
                        onChange={handleInputChange}
                        error={formErrors.location}
                      />

                      <InputField
                        className="col-12 col-md-4"
                        label="City"
                        name="city"
                        placeholder="Cox's Bazar"
                        value={formValues.city}
                        onChange={handleInputChange}
                        error={formErrors.city}
                      />
                      <InputField
                        className="col-12 col-md-4"
                        label="Country"
                        name="country"
                        placeholder="Bangladesh"
                        value={formValues.country}
                        onChange={handleInputChange}
                        error={formErrors.country}
                      />
                      <SelectField
                        className="col-12 col-md-2"
                        label="Star rating"
                        name="starRating"
                        value={formValues.starRating}
                        onChange={handleInputChange}
                        options={STAR_OPTIONS}
                      />
                      <SelectField
                        className="col-12 col-md-2"
                        label="Status"
                        name="status"
                        value={formValues.status}
                        onChange={handleInputChange}
                        options={STATUS_OPTIONS}
                      />

                      <div className="col-12">
                        <label className="form-label" htmlFor="hotel-description">
                          Description
                        </label>
                        <textarea
                          id="hotel-description"
                          name="description"
                          className="form-control"
                          rows={4}
                          placeholder="Describe the property, its location, and the guest experience."
                          value={formValues.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label" htmlFor="hotel-facilities">
                          Facilities
                        </label>
                        <textarea
                          id="hotel-facilities"
                          name="facilities"
                          className="form-control"
                          rows={3}
                          placeholder="Pool, Spa, WiFi, Parking"
                          value={formValues.facilities}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <div>
                            <div className="form-label mb-1">Photo URLs</div>
                            <div className="form-hint">Add one or more hosted image URLs for this hotel.</div>
                          </div>
                          <Button variant="outline" onClick={addPhoto}>
                            Add photo
                          </Button>
                        </div>

                        <div className="d-grid gap-2">
                          {formValues.photos.map((photo, photoIndex) => (
                            <div key={`photo-${photoIndex}`} className="d-flex gap-2">
                              <input
                                type="url"
                                className="form-control"
                                placeholder="https://example.com/images/hotel.jpg"
                                value={photo}
                                onChange={(event) => handlePhotoChange(photoIndex, event.target.value)}
                              />
                              <Button
                                variant="outline"
                                onClick={() => removePhoto(photoIndex)}
                                disabled={formValues.photos.length === 1}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <div>
                            <div className="form-label mb-1">Rooms</div>
                            <div className="form-hint">
                              Each room type can have its own amenities and seasonal pricing entries.
                            </div>
                          </div>
                          <Button variant="outline" onClick={addRoom}>
                            Add room
                          </Button>
                        </div>

                        <div className="d-grid gap-3">
                          {formValues.rooms.map((room, roomIndex) => (
                            <div key={`room-${roomIndex}`} className="border rounded p-3">
                              <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                                <div className="fw-semibold">Room {roomIndex + 1}</div>
                                <Button
                                  variant="outline"
                                  onClick={() => removeRoom(roomIndex)}
                                  disabled={formValues.rooms.length === 1}
                                >
                                  Remove room
                                </Button>
                              </div>

                              <div className="row g-3">
                                <InputField
                                  className="col-12 col-md-6"
                                  label="Type name"
                                  placeholder="Deluxe"
                                  value={room.typeName}
                                  onChange={(event) =>
                                    handleRoomChange(roomIndex, "typeName", event.target.value)
                                  }
                                />
                                <InputField
                                  className="col-12 col-md-6"
                                  label="Room size"
                                  placeholder="350 sqft"
                                  value={room.roomSize}
                                  onChange={(event) =>
                                    handleRoomChange(roomIndex, "roomSize", event.target.value)
                                  }
                                />
                                <InputField
                                  className="col-12 col-md-4"
                                  label="Max occupancy"
                                  type="number"
                                  min="1"
                                  placeholder="2"
                                  value={room.maxOccupancy}
                                  onChange={(event) =>
                                    handleRoomChange(roomIndex, "maxOccupancy", event.target.value)
                                  }
                                />
                                <InputField
                                  className="col-12 col-md-4"
                                  label="Total rooms"
                                  type="number"
                                  min="1"
                                  placeholder="10"
                                  value={room.totalRooms}
                                  onChange={(event) =>
                                    handleRoomChange(roomIndex, "totalRooms", event.target.value)
                                  }
                                />
                                <InputField
                                  className="col-12 col-md-4"
                                  label="Amenities"
                                  placeholder="AC, TV, Sea View"
                                  value={room.amenities}
                                  onChange={(event) =>
                                    handleRoomChange(roomIndex, "amenities", event.target.value)
                                  }
                                />
                              </div>

                              <div className="mt-4">
                                <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                                  <div className="fw-semibold">Seasonal prices</div>
                                  <Button variant="outline" onClick={() => addPrice(roomIndex)}>
                                    Add season
                                  </Button>
                                </div>

                                <div className="d-grid gap-3">
                                  {room.prices.map((price, priceIndex) => (
                                    <div key={`room-${roomIndex}-price-${priceIndex}`} className="border rounded p-3">
                                      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                                        <div className="text-secondary small">Price {priceIndex + 1}</div>
                                        <Button
                                          variant="outline"
                                          onClick={() => removePrice(roomIndex, priceIndex)}
                                          disabled={room.prices.length === 1}
                                        >
                                          Remove season
                                        </Button>
                                      </div>

                                      <div className="row g-3">
                                        <InputField
                                          className="col-12 col-md-4"
                                          label="Season start"
                                          type="date"
                                          value={price.seasonStart}
                                          onChange={(event) =>
                                            handlePriceChange(
                                              roomIndex,
                                              priceIndex,
                                              "seasonStart",
                                              event.target.value
                                            )
                                          }
                                        />
                                        <InputField
                                          className="col-12 col-md-4"
                                          label="Season end"
                                          type="date"
                                          value={price.seasonEnd}
                                          onChange={(event) =>
                                            handlePriceChange(
                                              roomIndex,
                                              priceIndex,
                                              "seasonEnd",
                                              event.target.value
                                            )
                                          }
                                        />
                                        <InputField
                                          className="col-12 col-md-4"
                                          label="Price per night"
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          placeholder="1400.00"
                                          value={price.pricePerNight}
                                          onChange={(event) =>
                                            handlePriceChange(
                                              roomIndex,
                                              priceIndex,
                                              "pricePerNight",
                                              event.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                      <Button type="submit" isLoading={hotelMutation.isPending}>
                        {isEditMode ? "Save changes" : "Create hotel"}
                      </Button>
                      <Link to={APP_ROUTES.hotel} className="btn btn-outline-primary">
                        Cancel
                      </Link>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            <div className="col-12 col-xl-4">
              <Card
                title="Current hotel snapshot"
                subtitle="Use this panel to confirm the outbound payload shape before saving."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Hotel</span>
                    <strong>{formValues.name || "Not set"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Location</span>
                    <strong>{formValues.location || "Not set"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Rating</span>
                    <strong>{formValues.starRating || "0"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Status</span>
                    <strong>{formValues.status === "1" ? "Active" : "Inactive"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Photos</span>
                    <strong>
                      {formValues.photos.map((photo) => String(photo ?? "").trim()).filter(Boolean).length}
                    </strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Rooms</span>
                    <strong>{formValues.rooms.length}</strong>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="fw-semibold mb-2">Room types</div>
                  <div className="d-grid gap-2">
                    {formValues.rooms.map((room, roomIndex) => (
                      <div key={`snapshot-room-${roomIndex}`} className="border rounded p-2">
                        <div className="fw-semibold">{room.typeName || `Room ${roomIndex + 1}`}</div>
                        <div className="text-secondary small">
                          {room.prices.length} seasonal price block{room.prices.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
