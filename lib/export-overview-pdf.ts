export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string
) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const image = canvas.toDataURL("image/jpeg", 0.92);

  let remaining = imgHeight;
  let offsetY = 0;
  let first = true;

  while (remaining > 0) {
    if (!first) pdf.addPage();
    pdf.addImage(image, "JPEG", 0, offsetY, imgWidth, imgHeight, undefined, "FAST");
    remaining -= pageHeight;
    offsetY -= pageHeight;
    first = false;
  }

  pdf.save(filename);
}
