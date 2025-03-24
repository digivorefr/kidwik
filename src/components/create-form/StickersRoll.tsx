import { useMemo } from "react";
import StickerPreview from "../calendar/StickerPreview";
import QuantityControls from "./QuantityControls";
import { FormStepProps } from "./types";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/Button";

type StickersRollProps = FormStepProps & {
  onNavigateToAddSticker?: () => void
}

export default function StickersRoll({
  formData, 
  handleActivityToggle, 
  themeClasses, 
  removeCustomActivity, 
  updateStickerQuantity, 
  handleObjectFitToggle,
  onNavigateToAddSticker,
}: StickersRollProps) {
  
  const reversedActivities = useMemo(() => {
    return [...formData.customActivities].reverse();
  }, [formData.customActivities]);

  if (!themeClasses || !handleActivityToggle || !removeCustomActivity || !updateStickerQuantity || !handleObjectFitToggle) return null

  return (
    <div className="flex gap-4 pt-2 pb-4 w-fit max-w-[calc(100svw-6rem)] overflow-x-auto md:min-w-[calc(100svw-6rem)] md:flex-wrap md:justify-center md:overflow-x-visible md:max-h-[40dvh] md:overflow-y-auto">
      {reversedActivities.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-xs text-center">Ajoutez des activités, et elles apparaîtront ici</p>
          {onNavigateToAddSticker && (
            <Button
              variant="color"
              size="sm"
              className="flex items-center gap-1"
              onClick={onNavigateToAddSticker}
              >
              <div className="material-symbols-rounded">add</div>
              <span>Ajouter une activité</span>
            </Button>
          )}
        </div>
      )}
      {reversedActivities.map(activity => {
          const isSelected = formData.selectedActivities.some(a => a.id === activity.id);
          
          return (
            <div key={activity.id} className="relative">
              <label className={cn("cursor-pointer", isSelected && "cursor-default")}>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isSelected}
                  onChange={() => {
                    // Seulement permettre la sélection (pas la désélection) par le clic
                    if (!isSelected) {
                      handleActivityToggle(activity);
                    }
                  }}
                />
                <div className="flex flex-col items-center space-y-2 p-2 rounded-lg border-1 border-transparent peer-checked:border-zinc-700 peer-checked:bg-zinc-900">
                  <StickerPreview
                    activity={activity}
                    themeClasses={themeClasses}
                    allowObjectFitToggle={true}
                    onObjectFitToggle={handleObjectFitToggle}
                  />
                  <span className="text-sm">{activity.name}</span>
                  <QuantityControls
                    formData={formData}
                    activityId={activity.id}
                    isSelected={isSelected}
                    updateStickerQuantity={updateStickerQuantity}
                  />
                </div>
              </label>
              {isSelected && (
                <button
                  onClick={() => removeCustomActivity(activity.id)}
                  className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              )}
            </div>
          )
        })}
    </div>
  )
}