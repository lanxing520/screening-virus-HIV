import * as XLSX from "xlsx"

/**
 * 读取Excel文件内容
 * @param {File} file 用户选择的文件对象
 * @returns {Promise<Array>} 返回解析后的数据数组
 */
export async function readExcelFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e?.target?.result as any)
        const workbook = XLSX.read(data, { type: "array" })
        // console.log(workbook)
        const dataObject = {} as any
        // 获取第一个工作表
        if (workbook.SheetNames.length) {
          workbook.SheetNames.forEach((e) => {
            const worksheet = workbook.Sheets[e]
            const data = XLSX.utils.sheet_to_json(worksheet)
            dataObject[e] = data
          })
          // console.log(dataObject)
        }
        resolve([dataObject])
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}
