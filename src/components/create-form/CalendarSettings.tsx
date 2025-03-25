import { DEFAULT_DAY_MOMENTS, SINGLE_DAY_MOMENT } from "@/app/create/types";
import { FormStepProps } from "./types";
import DayMomentManager from "./DayMomentManager";

export default function CalendarSettings({formData, updateFormField}: FormStepProps) {
  return (
    <div className="space-y-4 min-w-[300px]">
      <div className="flex items-start">
        <input
          type="checkbox"
          id="uppercase-weekdays"
          className="flex-none w-4 h-4 mt-1 "
          checked={formData.options.uppercaseWeekdays}
          onChange={(e) => {
            updateFormField('options', {
              ...formData.options,
              uppercaseWeekdays: e.target.checked
            })
          }}
        />
        <label htmlFor="uppercase-weekdays" className="flex-auto text-balance ml-2 text-sm">
          Jours de la semaine en majuscules
        </label>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="show-day-moments"
          className="flex-none w-4 h-4 mt-1"
          checked={formData.options.showDayMoments}
          onChange={(e) => {
            // Mettre à jour l'option showDayMoments
            updateFormField('options', {
              ...formData.options,
              showDayMoments: e.target.checked
            });

            // Mettre à jour les moments en fonction de l'option
            if (!e.target.checked) {
              updateFormField('dayMoments', SINGLE_DAY_MOMENT);
            } else if (formData.dayMoments.length === 1) {
              // Only replace if currently using SINGLE_DAY_MOMENT
              updateFormField('dayMoments', DEFAULT_DAY_MOMENTS);
            }
          }}
        />
        <label htmlFor="show-day-moments" className="flex-auto text-balance ml-2 text-sm">
          Afficher les moments de la journée (Matin, Après-midi, Soir)
        </label>
      </div>


      {/* Day Moments Manager - only show when showDayMoments is enabled */}
      {formData.options.showDayMoments && (
        <div className="ml-5">
          <DayMomentManager
            moments={formData.dayMoments}
            onChange={(newMoments) => {
              updateFormField('dayMoments', newMoments);
            }}
          />
        </div>
      )}
    </div>
  )
}