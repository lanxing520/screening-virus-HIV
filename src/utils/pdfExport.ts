// src/utils/pdfExport.ts
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

export const exportToPdf = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id ${elementId} not found`)
    return
  }

  const canvas = await html2canvas(element, {
    scale: 2, // 提高分辨率
    logging: false,
    useCORS: true, // 处理跨域图片
    allowTaint: true,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
  })
  pdf.setFontSize(20)
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
  pdf.save(`${filename}.pdf`)
}
