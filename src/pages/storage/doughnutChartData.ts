import { TDoughnutChartData } from './tchartdata/types'

export const profitBackground = '#154EC1'
export const expensesBackground = '#fff'
export const earningsBackground = '#ECF0F1'

export const doughnutChartData: TDoughnutChartData = {
  labels: ['ปริมาณที่ใช้ในงาน', 'ปริมาณที่เหลือ'],
  datasets: [
    {
      backgroundColor: [profitBackground, earningsBackground],
      data: [432, 167],
    },
  ],
}
