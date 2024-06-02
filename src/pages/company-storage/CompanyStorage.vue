<template>
  <h1 class="page-title">Company Storage</h1>
  <div class="flex justify-between w-full">
    <div class="flex flex-col w-full h-full">
      <VaCard :style="{ '--va-card-outlined-border': '3px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col mt-6 mb-5">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> LMN Ltd. </span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span>Sub: QC, OTH</span>
            </h6>
            <p>
              <span class="text-[var(--va-secondary)]">Email: </span>
              <span>lmn@example.com</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Phone: </span>
              <span>777-777-7777</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Address: </span>
              <span>555 Maple St, City, Country</span>
            </p>
            <RouterLink to="/company-token">
              <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(User)" />
            </RouterLink>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col h-full">
      <VaCard :style="{ '--va-card-outlined-border': '3px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="mt-2">
          <canvas id="pie-chart"></canvas>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
  <div class="flex justify-between">
    <div class="flex flex-col w-full h-full">
      <VaCard :style="{ '--va-card-outlined-border': '3px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> จำนวน ปริมาณข้อมูลที่เก็บไว้บน Server </span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> 10GB / 500GB </span>
            </h6>
            <img src="/public/db-image.png" alt="db-image" width="76" />
          </div>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
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
