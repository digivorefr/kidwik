interface Html2PdfOptions {
  margin?: number | [number, number, number, number];
  filename?: string;
  image?: { type: string; quality: number };
  html2canvas?: Record<string, unknown>;
  jsPDF?: {
    unit?: 'pt' | 'px' | 'in' | 'cm' | 'mm';
    format?: [number, number] | string;
    orientation?: 'portrait' | 'landscape';
  };
}

interface Html2PdfInstance {
  from(element: HTMLElement | string): Html2PdfInstance;
  set(options: Html2PdfOptions): Html2PdfInstance;
  save(): Promise<void>;
  toPdf(): unknown;
}

declare module '@digivorefr/html2pdf.js/dist/html2pdf.bundle.min.js' {
  function html2pdf(): Html2PdfInstance;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
  export = html2pdf;
}

declare module '@digivorefr/html2pdf.js' {
  function html2pdf(): Html2PdfInstance;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
  export = html2pdf;
}
