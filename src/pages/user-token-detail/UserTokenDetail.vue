<template>
  <h1 class="page-title">User Token Detail</h1>
  <div class="flex justify-between">
    <div class="flex flex-col w-full h-full">
      <VaCard :style="{ '--va-card-outlined-border': '3px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> XYZ Corporation </span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> John Doe </span>
            </h6>
            <p>
              <span class="text-[var(--va-secondary)]">Email: </span>
              <span> JohnDoe@mail.com</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Role: </span>
              <span class="va-text-bold"> User</span>
            </p>
            <RouterLink to="/user-storage">
              <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(User)" />
            </RouterLink>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col">
      <VaCard :style="{ '--va-card-outlined-border': '3px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> จำนวนการใช้งาน Token </span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> 1800 / 10000 </span>
            </h6>
            <img src="/public/db-image.png" alt="db-image" width="76" />
          </div>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
  <div class="flex justify-between">
    <div class="flex flex-col w-full">
      <VaCard :style="{ '--va-card-outlined-border': '3px solid var(--va-background-element)' }" outlined>
        <VaCardContent>
          <canvas id="column-chart"></canvas>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { VaCard, VaCardContent } from 'vuestic-ui'

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
