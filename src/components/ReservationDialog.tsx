import { useState } from "react";
import { Restaurant, ReservationActivity } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useTranslations } from "../i18n";
import { getRestaurantName } from "../utils/restaurant";

interface ReservationDialogProps {
  restaurant: Restaurant;
  open: boolean;
  onClose: () => void;
}

export const ReservationDialog = ({
  restaurant,
  open,
  onClose,
}: ReservationDialogProps) => {
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const [persons, setPersons] = useState<number>(2);
  const [time, setTime] = useState<string>("19:00");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const hasConfiguredDiscount =
    restaurant.specialDiscountHours &&
    restaurant.specialDiscountHours.includes(time);

  const parsedHour = parseInt(time.split(":")[0] || "0", 10);
  const hasFallbackDiscount =
    parsedHour >= 18 && parsedHour <= 20 && !hasConfiguredDiscount;

  const discountText =
    hasConfiguredDiscount && restaurant.specialDiscountText
      ? lang === "ar"
        ? restaurant.specialDiscountTextAr ?? restaurant.specialDiscountText
        : restaurant.specialDiscountText
      : hasFallbackDiscount
      ? t("reservation.specialDiscount")
      : t("reservation.noDiscount");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // In a real app, call API here. For now it's client-side only and we log to localStorage.
    try {
      const existingRaw = localStorage.getItem("reservationActivities");
      const existing: ReservationActivity[] = existingRaw ? JSON.parse(existingRaw) : [];
      const activity: ReservationActivity = {
        id: `${Date.now()}-${restaurant.id}`,
        restaurantId: restaurant.id,
        restaurantName: getRestaurantName(restaurant, lang),
        persons,
        time,
        createdAt: new Date().toISOString(),
      };
      const next = [activity, ...existing];
      localStorage.setItem("reservationActivities", JSON.stringify(next));
    } catch {
      // Ignore storage errors in demo
    }
  };

  const closeAndReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {t("reservation.title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {t("reservation.restaurantLabel")}: {getRestaurantName(restaurant, lang)}
            </p>
          </div>
          <button
            onClick={closeAndReset}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {t("reservation.numberOfPersons")}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={persons}
                onChange={(e) => setPersons(Number(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {t("reservation.time")}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-xs sm:text-sm text-orange-800">
            {discountText}
          </div>

          {submitted && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs sm:text-sm text-green-800">
              {t("reservation.success")}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeAndReset}
              className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t("reservation.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs sm:text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium"
            >
              {t("reservation.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationDialog;
