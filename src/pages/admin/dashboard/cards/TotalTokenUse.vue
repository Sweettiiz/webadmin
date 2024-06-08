<template>
  <VaCard class="flex flex-col">
    <VaCardTitle class="flex items-start justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Total Token Used</h1>
      <div class="flex gap-2">
        <VaSelect v-model="selectedDMY" :options="dmyOption" placeholder="select" preset="small" class="w-24" />
        <VaButton class="h-2" size="small" preset="primary">Export</VaButton>
      </div>
    </VaCardTitle>
    <div class="flex flex-col justify-start">
      <div class="flex justify-start mt-5">
        <div>
          <span class="ml-10">Total Token</span>
          <p class="ml-10 text-xl font-semibold">158,138</p>
        </div>
        <div>
          <span class="mt-3 ml-10">Use this month</span>
          <p class="ml-10 text-xl font-semibold">76,459</p>
        </div>
      </div>
    </div>
    <VaCardContent class="flex flex-col md:flex-row md:items-center h-full">
      <canvas id="column-chart"></canvas>
    </VaCardContent>
  </VaCard>
</template>

<script>
import Chart from 'chart.js/auto'
import { VaCard, VaCardContent, VaSelect, VaButton, VaCardTitle } from 'vuestic-ui'

const months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

const columnChartData = {
  labels: months,
  datasets: [
    {
      label: 'ข้อมูลเดือนนี้',
      data: [50, 10, 22, 39, 15, 20, 85, 32, 60, 50, 20, 30],
      backgroundColor: 'rgba(21, 78, 193, 1)', // สีพื้นหลังแถบ
      borderColor: 'rgba(21, 78, 193, 1)', // สีเส้นขอบแถบ
      borderWidth: 1, // ความหนาของเส้นขอบแถบ
    },
  ],
}
export default {
  components: {
    VaCard,
    VaCardContent,
    VaSelect,
    VaButton,
    VaCardTitle,
  },
  data() {
    return {
      chartData: columnChartData,
      chart: null,
      selectedDMY: '',
      dmyOption: ['Daily', 'Monthly', 'Yearly'],
    }
  },
  watch: {
    chartData() {
      this.chart.data.datasets.forEach((dataset, i) => {
        dataset.data = this.chartData.datasets[i].data
      })
      this.chart.update()
    },
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('column-chart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.chartData,
        options: {
          // ตั้งค่าต่างๆ ของ Chart ตามต้องการ
        },
      })
    },
  },
}
</script>

<style scoped>
#column-chart {
  width: 100%;
  height: 100%;
}
</style>
