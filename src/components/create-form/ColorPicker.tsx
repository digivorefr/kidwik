import { colorGroups } from "@/app/create/types";
import { ColorButton } from "../ui/Button";
import { FormStepProps } from "./types";



export default function ColorPicker({formData, updateFormField}: FormStepProps) {

  return (
    <div className="space-y-4">
      {Object.entries(colorGroups).map(([groupName, colors]) => (
        <div key={groupName}>
          <h4 className="text-sm text-zinc-400 mb-2">{groupName}</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <div className="w-[clamp(2.4rem,12%,100%)] flex-none" key={color}>
                <ColorButton
                  colorClass={`bg-${color}-500 border-${color}-600`}
                  colorName={color}
                  isSelected={formData.theme === color}
                  onClick={() => updateFormField('theme', color)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}