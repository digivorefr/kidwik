import { Tool } from "./types";
import Toolbar from ".";
import { useCallback } from "react";
import { useState } from "react";
import SaveAndExportCalendar from "@/components/create-form/SaveAndExportCalendar";
import GeneratePDFCalendar from "@/components/create-form/GeneratePDFCalendar";

const tools: Tool[] = [
  {
    id: 'generate',
    icon: 'download',
    label: 'Télécharger'
  },
  {
    id: 'save',
    icon: 'save',
  },
]

export default function FinalToolbar({ calendarId }: { calendarId?: string }) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const handleToolChange = useCallback((toolId: string | null) => {
    const tool = toolId ? tools.find(tool => tool.id === toolId) ?? null : null;
    setActiveTool(tool);
  }, []);

  return (
    <Toolbar tools={tools} activeTool={activeTool} onToolChange={handleToolChange}>
     {activeTool?.id === 'save' && (
      <SaveAndExportCalendar calendarId={calendarId} />
     )}
     {activeTool?.id === 'generate' && (
      <GeneratePDFCalendar />
     )}
    </Toolbar>
  )
}