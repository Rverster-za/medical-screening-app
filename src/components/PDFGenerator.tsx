const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
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
        page = pdfDoc.addPage();
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
