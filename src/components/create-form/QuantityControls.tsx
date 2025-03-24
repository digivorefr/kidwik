import { CalendarFormData } from "@/app/create/types";

type QuantityControlsProps = {
  formData: CalendarFormData;
  activityId: string;
  isSelected: boolean;
  updateStickerQuantity?: (activityId: string, quantity: number) => void;
}


export default function QuantityControls({formData, activityId, isSelected, updateStickerQuantity}: QuantityControlsProps) {

  const quantity = formData.stickerQuantities[activityId] || 1

  if (!updateStickerQuantity || !isSelected) return null

  return (
    <div className="flex items-center justify-center mt-1 bg-zinc-600 rounded-full px-0.5 py-0.5 select-none">
      <button
        type="button"
        className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900 border border-zinc-900 text-zinc-200 cursor-pointer"
        onClick={(e) => {
          e.preventDefault(); // Prevent checkbox toggle
          e.stopPropagation();
          updateStickerQuantity(activityId, Math.max(1, quantity - 1));
        }}
        aria-label="Réduire la quantité"
      >
        <span className="text-xs font-bold">-</span>
      </button>
      <div className="flex items-center mx-2">
        <span className="text-xs font-medium text-zinc-50">{quantity}</span>
        <span className="text-xs ml-1 text-zinc-100">copie{quantity > 1 ? 's' : ''}</span>
      </div>
      <button
        type="button"
        className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900 border border-zinc-900 text-zinc-200 cursor-pointer"
        onClick={(e) => {
          e.preventDefault(); // Prevent checkbox toggle
          e.stopPropagation();
          updateStickerQuantity(activityId, quantity + 1);
        }}
        aria-label="Augmenter la quantité"
      >
        <span className="text-xs font-bold">+</span>
      </button>
    </div>
  )
}