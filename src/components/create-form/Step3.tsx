'use client'
import { useState } from 'react'
import { FadeIn } from '@/components/ui/motion'
import { Step3Props } from './types'
import html2pdf from '@digivorefr/html2pdf.js'

function Step3({ handleSave, onPrevStep }: Step3Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    setErrorMessage('')

    try {
      // Récupérer les éléments uniquement par ID
      const calendarPreview = document.getElementById('calendar-preview');
      const stickersPreview = document.getElementById('stickers-preview');
      const coverPage = document.getElementById('cover-page');

      if (!calendarPreview) {
        throw new Error('Élément de prévisualisation du calendrier non trouvé. Assurez-vous que l\'élément avec l\'ID "calendar-preview" existe dans le DOM.');
      }

      if (!stickersPreview) {
        throw new Error('Élément de prévisualisation des stickers non trouvé. Assurez-vous que l\'élément avec l\'ID "stickers-preview" existe dans le DOM.');
      }

      if (!coverPage) {
        throw new Error('Élément de page de couverture non trouvé. Assurez-vous que l\'élément avec l\'ID "cover-page" existe dans le DOM.');
      }

      // Cloner les éléments pour ne pas modifier les originaux
      const calendarClone = calendarPreview.cloneNode(true) as HTMLElement;
      const stickersClone = stickersPreview.cloneNode(true) as HTMLElement;
      const coverPageClone = coverPage.cloneNode(true) as HTMLElement;

      // Obtenir le HTML et le nettoyer directement
      const calendarHtml = calendarClone.outerHTML;
      const stickersHtml = stickersClone.outerHTML;
      const coverPageHtml = coverPageClone.outerHTML;

      // Créer un conteneur pour le PDF avec le HTML nettoyé
      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = `
        <div class="pdf-container" style="background-color: white;">
          <!-- Première page : Page de garde -->
          <div class="pdf-page paper-shadow">
            ${coverPageHtml}
          </div>

          <!-- Deuxième page : Calendrier -->
          <div class="pdf-page">
            ${calendarHtml}
          </div>

          <!-- Troisième page : Gommettes -->
          <div class="pdf-page pdf-page--stickers">
            ${stickersHtml}
          </div>
        </div>
      `;

      // Ajouter temporairement à la page
      document.body.appendChild(pdfContent);

      // Configure html2pdf avec des options plus robustes
      const opt = {
        margin: 4,
        filename: 'calendrier-et-gommettes.pdf',
        image: { type: 'jpeg', quality: 0.85 },
        html2canvas: {
          scale: 4.16666667,
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff',
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4',
          orientation: 'landscape' as const,
          // margin: [0, 0, 0, 0],
        }
      };

      // Générer le PDF
      await html2pdf()
        .from(pdfContent)
        .set(opt)
        .save();

      // Nettoyer
      document.body.removeChild(pdfContent);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  return (
    <FadeIn>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col space-y-4">
          <div>
            <button
              onClick={onPrevStep}
              disabled={isGeneratingPDF}
              className="px-4 py-1.5 rounded-full text-sm border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium disabled:opacity-70 disabled:cursor-not-allowed mb-4"
            >
              Retour
            </button>
          </div>
          
          <h2 className="text-xl font-semibold">Votre calendrier est prêt à être téléchargé !</h2>

          <p className="mb-2">
            Vous allez pouvoir télécharger votre calendrier personnalisé ainsi que la planche de gommettes en format PDF.
          </p>

          <p className="mb-2">
            Après impression, découpez les gommettes en suivant les bordures et placez-les sur le calendrier selon vos besoins.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              <p><strong>Erreur:</strong> {errorMessage}</p>
            </div>
          )}

          <div className="flex flex-col space-y-4 mt-4">
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="btn-primary px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
              className="px-6 py-3 rounded-full text-sm border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="mr-2">💾</span>
              Sauvegarder mon calendrier
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export default Step3