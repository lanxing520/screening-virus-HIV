export type QuestionData = {
  question: string
  answer: string | string[]
  type: string
  tips?: string
  options: {
    label: string
    value: string
    img?: string
  }[]
}

export interface PdfTableData {
  id?: string
  question: string
  answer: string | string[]
  userAnswer: string | string[]
  reduceScore: number
}
