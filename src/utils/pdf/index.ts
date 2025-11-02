import jsPDF from "jspdf";
import pdfContext from "html2canvas";

export function generatePDF(pageRef: React.RefObject<HTMLElement>): void {
    const page = pageRef.current;

    if (!page) {
        return;
    }

    pdfContext(page).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4", true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
        const imageX = (pdfWidth - imageWidth * ratio) / 2;
        const imageY = 30;
        pdf.addImage(
            imageData,
            "PNG",
            imageX,
            imageY,
            imageWidth * ratio,
            imageHeight * ratio
        );
        pdf.save("cfi-document.pdf");
    });
}
