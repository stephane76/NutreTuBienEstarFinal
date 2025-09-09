import jsPDF from 'jspdf';
import { MandalaDesign, createMandalaContent } from './mandalaGenerator';

export class PDFGenerator {
  private static instance: PDFGenerator;
  
  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  /**
   * Generar PDF individual de un mandala
   */
  async generateSingleMandala(design: MandalaDesign): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Título de la página
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(design.name, pageWidth / 2, 20, { align: 'center' });
    
    // Subtítulo con dificultad y tema
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${design.difficulty} • ${design.theme}`, pageWidth / 2, 30, { align: 'center' });
    
    // Descripción
    pdf.setFontSize(10);
    const descriptionLines = pdf.splitTextToSize(design.description, pageWidth - 40);
    pdf.text(descriptionLines, 20, 40);
    
    // Generar SVG del mandala
    const svgContent = createMandalaContent(design);
    
    try {
      // Convertir SVG a imagen y añadir al PDF
      await this.addSVGToPDF(pdf, svgContent, 20, 60, 170, 170);
      
      // Beneficios
      if (design.benefits.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Beneficios terapéuticos:', 20, 250);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        let yPosition = 260;
        
        design.benefits.forEach((benefit, index) => {
          pdf.text(`• ${benefit}`, 25, yPosition);
          yPosition += 8;
        });
      }
      
      // Instrucciones
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      const instructions = [
        'Instrucciones para colorear:',
        '• Encuentra un lugar tranquilo y cómodo',
        '• Respira profundamente antes de comenzar',
        '• Colorea despacio, sin prisa',
        '• Deja que tu mente se relaje mientras coloreas',
        '• No hay reglas, sigue tu intuición con los colores'
      ];
      
      let instructionY = pageHeight - 50;
      instructions.forEach(instruction => {
        pdf.text(instruction, 20, instructionY);
        instructionY += 6;
      });
      
    } catch (error) {
      console.error('Error adding SVG to PDF:', error);
      // Fallback: añadir un marcador de posición
      pdf.setFontSize(14);
      pdf.text('Mandala para colorear', pageWidth / 2, 150, { align: 'center' });
      pdf.rect(20, 60, 170, 170);
    }
    
    // Descargar el PDF
    pdf.save(`mandala-${design.id}.pdf`);
  }

  /**
   * Generar PDF con colección de mandalas
   */
  async generateMandalaCollection(designs: MandalaDesign[], collectionName: string): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Página de portada
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(collectionName, pageWidth / 2, 50, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Mandalas Terapéuticos para Colorear', pageWidth / 2, 70, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`${designs.length} diseños únicos para meditación y relajación`, pageWidth / 2, 90, { align: 'center' });
    
    // Índice
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Contenido:', 20, 120);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    let indexY = 135;
    
    designs.forEach((design, index) => {
      pdf.text(`${index + 1}. ${design.name}`, 25, indexY);
      pdf.text(`${design.difficulty} • ${design.theme}`, 25, indexY + 6);
      indexY += 20;
    });
    
    // Generar página para cada mandala
    for (let i = 0; i < designs.length; i++) {
      const design = designs[i];
      
      pdf.addPage();
      
      // Título de la página
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${i + 1}. ${design.name}`, pageWidth / 2, 20, { align: 'center' });
      
      // Información del mandala
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Dificultad: ${design.difficulty} | Tema: ${design.theme}`, pageWidth / 2, 30, { align: 'center' });
      
      // Descripción
      const descriptionLines = pdf.splitTextToSize(design.description, pageWidth - 40);
      pdf.text(descriptionLines, 20, 45);
      
      try {
        // Generar y añadir mandala
        const svgContent = createMandalaContent(design);
        await this.addSVGToPDF(pdf, svgContent, 20, 60, 170, 170);
        
      } catch (error) {
        console.error(`Error generating mandala ${design.name}:`, error);
        // Fallback
        pdf.setFontSize(14);
        pdf.text(design.name, pageWidth / 2, 150, { align: 'center' });
        pdf.rect(20, 60, 170, 170);
      }
      
      // Beneficios en la parte inferior
      if (design.benefits.length > 0) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Beneficios: ${design.benefits.join(' • ')}`, 20, pageHeight - 20);
      }
    }
    
    // Descargar el PDF
    pdf.save(`coleccion-mandalas-${collectionName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  }

  /**
   * Añadir SVG al PDF (método helper)
   */
  private async addSVGToPDF(
    pdf: jsPDF, 
    svgContent: string, 
    x: number, 
    y: number, 
    width: number, 
    height: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Crear un elemento SVG temporal
        const svgElement = document.createElement('div');
        svgElement.style.position = 'absolute';
        svgElement.style.left = '-9999px';
        svgElement.style.top = '-9999px';
        svgElement.innerHTML = svgContent;
        document.body.appendChild(svgElement);
        
        // Convertir SVG a canvas usando html2canvas (si está disponible)
        // Por ahora, usaremos un método simplificado
        
        // Crear un canvas temporal
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = 400;
          canvas.height = 400;
          
          // Fondo blanco
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 400, 400);
          
          // Dibujar un patrón simple como placeholder
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          
          // Círculos concéntricos
          const centerX = 200;
          const centerY = 200;
          
          for (let r = 20; r <= 180; r += 20) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
            ctx.stroke();
          }
          
          // Líneas radiales
          for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * (Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
              centerX + Math.cos(angle) * 180,
              centerY + Math.sin(angle) * 180
            );
            ctx.stroke();
          }
          
          // Convertir canvas a imagen
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          pdf.addImage(imgData, 'JPEG', x, y, width, height);
        }
        
        // Limpiar
        document.body.removeChild(svgElement);
        resolve();
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generar PDF con todas las colecciones
   */
  async generateCompleteMandalaBook(collections: { name: string; designs: MandalaDesign[] }[]): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Portada principal
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Libro Completo de', pageWidth / 2, 60, { align: 'center' });
    pdf.text('Mandalas Terapéuticos', pageWidth / 2, 80, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('para Colorear y Meditar', pageWidth / 2, 100, { align: 'center' });
    
    const totalMandalas = collections.reduce((sum, col) => sum + col.designs.length, 0);
    pdf.setFontSize(14);
    pdf.text(`${totalMandalas} diseños únicos organizados en ${collections.length} colecciones`, 
              pageWidth / 2, 120, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Diseñado para acompañar tu proceso de sanación y bienestar', 
              pageWidth / 2, 140, { align: 'center' });
    
    // Índice general
    pdf.addPage();
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Índice General', pageWidth / 2, 30, { align: 'center' });
    
    let currentY = 50;
    let mandalaCounter = 1;
    
    collections.forEach((collection, collectionIndex) => {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${collectionIndex + 1}. ${collection.name}`, 20, currentY);
      currentY += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      collection.designs.forEach(design => {
        pdf.text(`   ${mandalaCounter}. ${design.name} (${design.difficulty})`, 25, currentY);
        currentY += 7;
        mandalaCounter++;
        
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 30;
        }
      });
      
      currentY += 5;
    });
    
    // Generar cada colección
    mandalaCounter = 1;
    
    for (const collection of collections) {
      // Página de separador de colección
      pdf.addPage();
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text(collection.name, pageWidth / 2, pageHeight / 2, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${collection.designs.length} mandalas únicos`, pageWidth / 2, (pageHeight / 2) + 20, { align: 'center' });
      
      // Generar cada mandala de la colección
      for (const design of collection.designs) {
        pdf.addPage();
        
        // Título
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${mandalaCounter}. ${design.name}`, pageWidth / 2, 20, { align: 'center' });
        
        // Info
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${design.difficulty} • ${design.theme}`, pageWidth / 2, 30, { align: 'center' });
        
        // Descripción
        const desc = pdf.splitTextToSize(design.description, pageWidth - 40);
        pdf.text(desc, 20, 45);
        
        // Mandala
        try {
          const svgContent = createMandalaContent(design);
          await this.addSVGToPDF(pdf, svgContent, 20, 60, 170, 170);
        } catch (error) {
          console.error(`Error with mandala ${design.name}:`, error);
          pdf.rect(20, 60, 170, 170);
          pdf.setFontSize(12);
          pdf.text('Espacio para colorear', pageWidth / 2, 150, { align: 'center' });
        }
        
        // Beneficios
        if (design.benefits.length > 0) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text(`Beneficios: ${design.benefits.join(' • ')}`, 20, pageHeight - 20);
        }
        
        mandalaCounter++;
      }
    }
    
    // Descargar
    pdf.save('libro-completo-mandalas-terapeuticos.pdf');
  }
}

// Exportar instancia singleton
export const pdfGenerator = PDFGenerator.getInstance();