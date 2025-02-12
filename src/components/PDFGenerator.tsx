import React, { useState } from 'react';
import { Screening } from '../data/screenings';
import { UserInput } from '../types/types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PDFGeneratorProps {
  screenings: Screening[];
  userInput: UserInput;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ screenings, userInput }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header
    page.drawText('Medical Screening Recommendations', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
    });

    // Patient Info
    page.drawText(`Patient Profile:`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: boldFont,
    });

    page.drawText(`Age: ${userInput.age}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font,
    });

    page.drawText(`Gender: ${userInput.gender}`, {
      x: 50,
      y: height - 140,
      size: 12,
      font,
    });

    // Risk Factors
    const riskFactors = Object.entries(userInput.riskFactors)
      .filter(([key, value]) => key !== 'familyHistory' && value)
      .map(([key]) => key);

    const familyHistory = Object.entries(userInput.riskFactors.familyHistory)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (riskFactors.length > 0) {
      page.drawText(`Risk Factors: ${riskFactors.join(', ')}`, {
        x: 50,
        y: height - 160,
        size: 12,
        font,
      });
    }

    if (familyHistory.length > 0) {
      page.drawText(`Family History: ${familyHistory.join(', ')}`, {
        x: 50,
        y: height - 180,
        size: 12,
        font,
      });
    }

    // Recommended Screenings
    page.drawText('Recommended Screenings:', {
      x: 50,
      y: height - 220,
      size: 14,
      font: boldFont,
    });

    let yOffset = 250;
    screenings.forEach((screening, index) => {
      // Add new page if needed
      if (yOffset > height - 50) {
        const newPage = pdfDoc.addPage();
        page = newPage;
        yOffset = 50;
      }

      page.drawText(`${index + 1}. ${screening.name}`, {
        x: 50,
        y: height - yOffset,
        size: 12,
        font: boldFont,
      });

      page.drawText(`Description: ${screening.description}`, {
        x: 70,
        y: height - (yOffset + 20),
        size: 10,
        font,
        maxWidth: width - 100,
      });

      page.drawText(`Frequency: ${screening.frequency}`, {
        x: 70,
        y: height - (yOffset + 40),
        size: 10,
        font,
      });

      yOffset += 70;
    });

    // Footer
    const today = new Date().toLocaleDateString();
    page.drawText(`Generated on: ${today}`, {
      x: 50,
      y: 50,
      size: 10,
      font,
    });

    page.drawText('This report is for informational purposes only. Please consult with your healthcare provider.', {
      x: 50,
      y: 30,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    return pdfDoc.save();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      const pdfBytes = await generatePDF();
      const formData = new FormData();
      formData.append('email', email);
      formData.append('pdf', new Blob([pdfBytes], { type: 'application/pdf' }));

      // In a real app, you would send this to your backend
      // const response = await fetch('/api/send-pdf', {
      //   method: 'POST',
      //   body: formData,
      // });

      // For demo, we'll create a download instead
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'screening-recommendations.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus('success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          Download or Email Recommendations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Your Recommendations</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address (optional)
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white"
            >
              {isLoading ? 'Generating...' : 'Generate PDF'}
            </Button>
          </div>
          {status === 'success' && (
            <p className="text-green-600">PDF generated successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-600">Error generating PDF. Please try again.</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PDFGenerator;
