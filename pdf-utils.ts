import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface StandardPDFOptions {
  title: string;
  subtitle?: string;
  generatedDate?: string;
  companyInfo: CompanyInfo;
}

export function createStandardPDFHeader(doc: jsPDF, options: StandardPDFOptions): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header - Company Name
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(options.companyInfo.name, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Care and Support Management System', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Document Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Generation Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const generatedDate = options.generatedDate || new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  doc.text(`Generated: ${generatedDate}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  return yPosition;
}

export function addStandardFooter(doc: jsPDF): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This document was generated automatically by the Care and Support Management System',
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );
}

export function createFieldValueTable(
  doc: jsPDF, 
  fields: Array<[string, string]>, 
  startY: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = startY;

  // Headers
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Field', 20, yPosition);
  doc.text('Value', 80, yPosition);
  yPosition += 5;

  // Draw line under headers
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  // Field-value pairs
  doc.setFont('helvetica', 'normal');
  fields.forEach(([field, value]) => {
    doc.text(field, 20, yPosition);
    doc.text(value, 80, yPosition);
    yPosition += 8;
  });

  return yPosition + 10;
}

export function addTextSection(
  doc: jsPDF, 
  title: string, 
  content: string, 
  startY: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = startY;

  // Section title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, yPosition);
  yPosition += 10;

  // Content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(content || 'No information recorded', pageWidth - 40);
  doc.text(lines, 25, yPosition);
  yPosition += lines.length * 5 + 10;

  return yPosition;
}

export function formatAustralianDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatAustralianDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateStandardFilename(
  prefix: string,
  identifier: string,
  date?: string | Date
): string {
  const dateStr = date 
    ? (typeof date === 'string' ? date : date.toISOString().split('T')[0])
    : new Date().toISOString().split('T')[0];
  
  return `${prefix}-${identifier.replace(/\s+/g, '-')}-${dateStr}.pdf`;
}