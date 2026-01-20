import { useState } from "react";
import { Restaurant } from "../types";
import { useLanguage } from "../context/LanguageContext";

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
      ? lang === "ar"
        ? "خصم خاص على العشاء في هذه الساعة."
        : "Special dinner discount at this hour."
      : lang === "ar"
      ? "لا يوجد عرض خاص في هذه الساعة."
      : "No special discount at this hour.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, call API here. For now it's client-side only.
  };

  const closeAndReset = () => {
    setSubmitted(false);
    onClose();
  };

  const title =
    lang === "ar"
      ? "حجز طاولة"
      : "Reserve a table";

  const confirmLabel = lang === "ar" ? "تأكيد الحجز" : "Confirm reservation";
  const cancelLabel = lang === "ar" ? "إلغاء" : "Cancel";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {lang === "ar"
                ? `المطعم: ${restaurant.nameAr ?? restaurant.name}`
                : `Restaurant: ${restaurant.name}`}
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
                {lang === "ar" ? "عدد الأشخاص" : "Number of persons"}
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
                {lang === "ar" ? "الساعة" : "Time"}
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
              {lang === "ar"
                ? "تم إرسال طلب الحجز بنجاح (تجريبي فقط على الواجهة)."
                : "Reservation request submitted successfully (client-side demo only)."}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeAndReset}
              className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs sm:text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium"
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationDialog;
