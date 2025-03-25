import { useCallback, useMemo, useState } from "react";
import { FormStepProps } from "../../create-form/types";
import Toolbar from ".";
import { Tool } from "./types";
import HeroImage from "@/components/create-form/HeroImage";
import StickersRoll from "@/components/create-form/StickersRoll";
import AddSticker from "@/components/create-form/AddSticker";

const tools: Tool[] = [
  {
    id: 'child_photo',
    icon: 'crown',
    label: 'Héros',
  },
  {
    id: 'stickers',
    icon: 'apps',
    label: 'Activités',
  },
  {
    id: 'add-sticker',
    icon: 'add',
    label: 'Ajouter',
  }
]

export default function StickerToolbar(props: FormStepProps) {

  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const handleToolChange = useCallback((toolId: string | null) => {
    const tool = toolId ? tools.find(tool => tool.id === toolId) ?? null : null;
    setActiveTool(tool);
  }, []);


  const children = useMemo(() => {
    switch (activeTool?.id){
      case 'child_photo':
        return (
          <HeroImage {...props} />
        )
      case 'stickers':
        return (<StickersRoll {...props} onNavigateToAddSticker={() => handleToolChange('add-sticker')} />)
      case 'add-sticker':
        return (<AddSticker {...props} onNavigateToStickersList={() => handleToolChange('stickers')} />)
      default: return null;
    }
  }, [activeTool?.id, handleToolChange, props])

  return (
    <Toolbar
      activeTool={activeTool}
      tools={tools} 
      onToolChange={handleToolChange}
      titleClassName="text-center"
    >
      {children}
    </Toolbar>
  )
}