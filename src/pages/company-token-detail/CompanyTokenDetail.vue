<template>
  <h1 class="page-title">Company Token Detail</h1>
  <div class="flex justify-between w-7/8">
    <div class="flex flex-col w-full h-full">
      <VaCard :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col">
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
            <RouterLink to="/company-storage">
              <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(User)" />
            </RouterLink>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col w-full h-full">
      <VaCard :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col mt-12 mb-5">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> จำนวน Token ทั้งหมด </span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> 10,000 / 1,000,000 </span>
            </h6>
            <img src="/public/db-image.png" alt="db-image" width="76" />
          </div>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
  <div class="flex justify-between">
    <div class="flex flex-col w-full">
      <VaCard :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }" outlined>
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