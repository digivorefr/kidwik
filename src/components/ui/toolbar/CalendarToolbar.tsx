import { useMemo, useState } from "react";
import Toolbar from ".";
import BackgroundUpload from "../../create-form/BackgroundUpload";
import CalendarSettings from "../../create-form/CalendarSettings";
import ColorPicker from "../../create-form/ColorPicker";
import { FormStepProps } from "../../create-form/types";
import { Tool } from "./types";

const tools: Tool[] = [
  {
    id: 'background',
    icon: 'wallpaper',
    label: 'Fond',
  },
  {
    id: 'color',
    icon: 'palette',
    label: 'Couleur',
  },
  {
    id: 'settings',
    icon: 'tune',
    label: 'Options',
  }
]

export default function CalendarToolbar({formData, updateFormField, removeBackgroundImage}: FormStepProps) {

  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const handleToolChange = (toolId: string | null) => {
    const tool = toolId ? tools.find(tool => tool.id === toolId) ?? null : null;
    setActiveTool(tool);
  }

  const children = useMemo(() => {
    switch (activeTool?.id){
      case 'background':
        return (
          <BackgroundUpload
            formData={formData}
            updateFormField={updateFormField}
            removeBackgroundImage={removeBackgroundImage}
          />
        )
      case 'color':
        return (
          <ColorPicker
            formData={formData}
            updateFormField={updateFormField}
          />
        )
      case 'settings':
        return (
          <CalendarSettings
            formData={formData}
            updateFormField={updateFormField}
          />
        )
      default: return null;
    }
  }, [activeTool?.id, formData, removeBackgroundImage, updateFormField])

  return (
    <Toolbar
      tools={tools}
      onToolChange={handleToolChange}
    >
      {children}
    </Toolbar>
  )
}