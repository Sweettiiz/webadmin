<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">Prediction</h1>
    </VaCardTitle>
    <VaCardContent>
      <section>
        <div class="text-xl font-bold mb-2">6,820</div>
        <p class="text-xs text-success">
          <VaIcon name="arrow_upward" />
          25.36%
          <span class="text-secondary"> เดือนที่แล้ว</span>
        </p>
      </section>
      <div class="w-full flex items-center">
        <canvas id="line-chart"></canvas>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script>
import Chart from 'chart.js/auto'
import { VaCard, VaCardContent, VaCardTitle } from 'vuestic-ui'

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
    VaCardTitle,
  },
  data() {
    return {
      chartData: columnChartData,
      chart: null,
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
      const ctx = document.getElementById('line-chart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
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
#line-chart {
  width: 100%;
  height: 100%;
}
</style>
