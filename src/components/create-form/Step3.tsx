import { useState } from 'react'
import { FadeIn } from '@/components/ui/motion'
import { Step3Props } from './types'
import html2pdf from 'html2pdf.js'

function Step3({ handleSave, onPrevStep }: Step3Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Force both previews to be visible for the PDF
      
      // First, find both preview containers
      let calendarContainer = document.querySelector('.calendar-preview-container') as HTMLElement;
      let stickersContainer = document.querySelector('.stickers-preview-container') as HTMLElement;
      
      // If either container is missing, we need to find the parent and force toggle the view
      if (!calendarContainer || !stickersContainer) {
        // Save current preview mode from data attributes
        const currentActiveButton = document.querySelector('[data-preview-mode-toggle].bg-gray-800') as HTMLElement;
        const currentMode = currentActiveButton?.getAttribute('data-preview-mode-toggle') || 'calendar';
        
        // Temporarily click the other button to render the missing container
        if (!calendarContainer && currentMode === 'stickers') {
          const calendarButton = document.querySelector('[data-preview-mode-toggle="calendar"]') as HTMLElement;
          calendarButton?.click();
          // Now try to get the container again
          calendarContainer = document.querySelector('.calendar-preview-container') as HTMLElement;
        }
        
        if (!stickersContainer && currentMode === 'calendar') {
          const stickersButton = document.querySelector('[data-preview-mode-toggle="stickers"]') as HTMLElement;
          stickersButton?.click();
          // Now try to get the container again
          stickersContainer = document.querySelector('.stickers-preview-container') as HTMLElement;
        }
        
        // Restore original view
        const originalButton = document.querySelector(`[data-preview-mode-toggle="${currentMode}"]`) as HTMLElement;
        originalButton?.click();
      }
      
      // If we still don't have both containers, use the print-only sections as fallback
      if (!calendarContainer) {
        calendarContainer = document.querySelector('.hidden.print\\:block:nth-child(1)') as HTMLElement;
      }
      
      if (!stickersContainer) {
        stickersContainer = document.querySelector('.hidden.print\\:block:nth-child(2)') as HTMLElement;
      }
      
      if (!calendarContainer || !stickersContainer) {
        throw new Error('Cannot find calendar or stickers elements for PDF generation');
      }
      
      // Create a temporary container for the PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '-9999px';
      document.body.appendChild(pdfContainer);
      
      // Clone the elements to the PDF container
      const calendarClone = calendarContainer.cloneNode(true) as HTMLElement;
      const stickersClone = stickersContainer.cloneNode(true) as HTMLElement;
      
      // Create the PDF pages
      const calendarPage = document.createElement('div');
      calendarPage.className = 'pdf-page';
      calendarPage.style.pageBreakAfter = 'always';
      calendarPage.appendChild(calendarClone);
      
      const stickersPage = document.createElement('div');
      stickersPage.className = 'pdf-page';
      stickersPage.appendChild(stickersClone);
      
      // Add pages to the container
      pdfContainer.appendChild(calendarPage);
      pdfContainer.appendChild(stickersPage);
      
      // Configure html2pdf
      const opt = {
        margin: 10,
        filename: 'calendrier-et-gommettes.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };
      
      // Generate and download the PDF
      await html2pdf().from(pdfContainer).set(opt).save();
      
      // Clean up
      document.body.removeChild(pdfContainer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }
  
  return (
    <FadeIn>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Votre calendrier est prêt à télécharger !</h2>
        
        <p className="mb-6">
          Vous allez pouvoir télécharger votre calendrier personnalisé ainsi que la planche de gommettes en format PDF.
          Après impression, découpez les gommettes en suivant les bordures et placez-les sur le calendrier selon vos besoins.
        </p>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération du PDF en cours...
              </>
            ) : (
              <>
                <span className="mr-2">📥</span>
                Télécharger mon calendrier et mes gommettes
              </>
            )}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isGeneratingPDF}
            className="px-6 py-3 rounded-lg border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="mr-2">💾</span>
            Sauvegarder mon calendrier
          </button>
        </div>
        
        <div className="mt-8 flex justify-start">
          <button
            onClick={onPrevStep}
            disabled={isGeneratingPDF}
            className="px-6 py-2 rounded-lg border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Retour
          </button>
        </div>
      </div>
    </FadeIn>
  )
}

export default Step3