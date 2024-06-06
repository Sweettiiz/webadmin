<template>
  <VaCard>
    <VaCardTitle class="flex items-start justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Storage Used</h1>
      <div class="flex gap-2">
        <VaSelect preset="small" class="w-24" />
      </div>
    </VaCardTitle>
    <VaCardContent class="flex flex-row gap-1">
      <section class="flex">
        <div class="text-xl font-bold mb-2">36,358</div>
      </section>
      <div class="flex w-1/2">
        <canvas id="pie-chart"></canvas>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script>
import Chart from 'chart.js/auto'
import { VaCard, VaCardContent } from 'vuestic-ui'

const usageAndRemainingData = {
  labels: ['ปริมาณที่ใช้ในงาน', 'ปริมาณที่เหลือ'],
  datasets: [
    {
      label: 'ข้อมูลเดือนนี้',
      data: [70, 30],
      backgroundColor: [
        'rgba(21, 78, 193, 1)', // สีสำหรับปริมาณที่ใช้งาน
        'rgb(245, 245, 245)', // สีสำหรับปริมาณที่เหลือ
      ],
      borderColor: [
        'rgba(21, 78, 193, 1)', // สีเส้นขอบสำหรับปริมาณที่ใช้งาน
        'rgb(245, 245, 245)', // สีเส้นขอบสำหรับปริมาณที่เหลือ
      ],
      borderWidth: 1,
    },
  ],
}
export default {
  components: {
    VaCard,
    VaCardContent,
  },
  data() {
    return {
      chartData: usageAndRemainingData,
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
      const ctx = document.getElementById('pie-chart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: this.chartData,
        options: {
          // ตั้งค่าต่างๆ ของ Chart ตามต้องการ
          layout: {
            padding: 1,
          },
        },
      })
    },
  },
}
</script>

<style scoped>
#pie-chart {
  width: 100%;
  height: 100%;
}
</style>
