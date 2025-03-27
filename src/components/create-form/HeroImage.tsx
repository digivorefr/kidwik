import { FormStepProps, ProcessedImageEvent } from "./types";
import useImageUpload from "@/lib/hooks/useImageUpload";
import { useCallback } from "react";
import ImageStickerPreview from "../calendar/ImageStickerPreview";
import QuantityControls from "./QuantityControls";

export default function HeroImage({
  childPhoto, 
  formData, 
  handlePhotoUpload, 
  themeClasses, 
  updateStickerQuantity,
}: FormStepProps) {
  
  // Image upload hook for child photo
  const childPhotoUpload = useImageUpload({
    preset: 'CHILD_PHOTO',
    onSuccess: () => {
      // We don't need to do anything special in the success callback
      // as we'll handle passing the processed image to the parent in the
      // handleChildPhotoUpload function
    },
    onError: (error) => {
      console.error('Error uploading child photo:', error)
      alert(error)
    }
  })

  // Handler for child photo upload
  const handleChildPhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !handlePhotoUpload) return

    // Process the image for optimization
    const processedImageUrl = await childPhotoUpload.upload(file)

    // If processing was successful, pass the processed image directly to the parent
    if (processedImageUrl) {
      // Pass the processed image URL directly to the parent's handlePhotoUpload
      // The parent function has been modified to handle both File objects and direct data URLs
      handlePhotoUpload({
        target: {
          files: [processedImageUrl]
        }
      } as ProcessedImageEvent)
    }
  }, [childPhotoUpload, handlePhotoUpload])


  return (
    <div className="grid gap-4">
      
      <div className="grid gap-4">
        {childPhoto && themeClasses && (
          <div className="flex flex-col items-center gap-2 pt-6">
            <ImageStickerPreview
              image={childPhoto}
              themeClasses={themeClasses}
              isHeroImage={true}
            />
            <QuantityControls
              formData={formData}
              activityId="childPhoto"
              isSelected={true}
              updateStickerQuantity={updateStickerQuantity}
            />
          </div>
        )}


        <div className="text-xs text-center">
          {childPhoto 
          ? 'Vous pourrez déplacer cette gommette chaque jour sur le calendrier.' 
          : 'Pour être le héros de la semaine, il faut avoir sa propre gommette!'}
          
        </div>


      </div>

      <label 
        className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-600 rounded-lg p-4 cursor-pointer hover:bg-zinc-900"
      >
        <div className="text-center">
          <div className="text-zinc-400">
            {childPhoto ? 'Changer la photo' : 'Ajouter une photo'}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            JPG, PNG (max. 20 Mo)
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChildPhotoUpload}
        />
      </label>

      {childPhotoUpload.error && (
        <p className="text-sm text-center text-balance text-red-500">{childPhotoUpload.error}</p>
      )}

      {childPhotoUpload.stats && !childPhotoUpload.error && (
        <div className="text-xs text-gray-500 flex flex-wrap justify-between">
          <span>Taille: {Math.round(childPhotoUpload.stats.compressedSize / 1024)} Ko</span>
          <span>Dimensions: {childPhotoUpload.stats.width} × {childPhotoUpload.stats.height}</span>
        </div>
      )}

    </div>
  )
}
