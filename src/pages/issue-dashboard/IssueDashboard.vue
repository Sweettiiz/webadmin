<template>
  <h1 class="page-title">Issue Dashboard</h1>
  <VaCard class="mb-5">
    <VaCardContent>
      <div class="flex justify-end">
        <VaSelect v-model="selectedDMY" :options="dmyOption" placeholder="select" preset="small" class="w-24" />
      </div>
      <canvas id="column-chart"></canvas>
    </VaCardContent>
  </VaCard>
  <VaCard>
    <VaCardContent>
      <section class="flex flex-col gap-4 mt-5">
        <div class="flex flex-col gap-4">
          <VaDataTable :items="items" />
        </div>
      </section>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { defineComponent } from 'vue'
import Chart from 'chart.js/auto'

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
      label: 'new',
      data: [50, 10, 22, 39, 15, 25, 85, 32, 60, 50, 20, 30],
      backgroundColor: 'rgba(21, 78, 193, 1)', // สีพื้นหลังแถบ
      borderColor: 'rgba(21, 78, 193, 1)', // สีเส้นขอบแถบ
      borderWidth: 0.5, // ความหนาของเส้นขอบแถบ
      borderRadius: 10, // ความโค้งมนของเส้นขอบแถบ
      barThickness: 10, // ความหนาของเส้น
    },
    {
      label: 'in progress',
      data: [30, 5, 10, 16, 10, 15, 50, 12, 30, 25, 10, 15],
      backgroundColor: 'rgb(246, 200, 57)', // สีพื้นหลังแถบ
      borderColor: 'rgb(246, 200, 57)', // สีเส้นขอบแถบ
      borderWidth: 0.5, // ความหนาของเส้นขอบแถบ
      borderRadius: 10, // ความโค้งมนของเส้นขอบแถบ
      barThickness: 10, // ความหนาของเส้น
    },
    {
      label: 'completely',
      data: [20, 5, 12, 23, 5, 10, 35, 20, 30, 25, 10, 15],
      backgroundColor: 'rgb(51, 157, 38)', // สีพื้นหลังแถบ
      borderColor: 'rgb(51, 157, 38)', // สีเส้นขอบแถบ
      borderWidth: 0.5, // ความหนาของเส้นขอบแถบ
      borderRadius: 10, // ความโค้งมนของเส้นขอบแถบ
      barThickness: 10, // ความหนาของเส้น
    },
  ],
}

export default defineComponent({
  data() {
    return {
      selectedDMY: '',
      dmyOption: ['Daily', 'Monthly', 'Yearly'],
      chartData: columnChartData,
      chart: null,
      items: [],
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
    // ดึง access token จาก localStorage
    const accessToken = localStorage.getItem('access_token')

    // ตรวจสอบว่ามี access token หรือไม่
    if (!accessToken) {
      console.error('ไม่พบ access token ใน localStorage')
    } else {
      // สร้าง Header สำหรับการส่ง request
      const headers = {
        Accept: 'application/json',
        Authorization: accessToken,
      }

      // ทำ GET request โดยใช้ fetch API
      fetch('http://89.213.177.27:8001/v1/owner/system_management/issue_owner', {
        method: 'GET',
        headers: headers,
      })
        .then((response) => {
          // ตรวจสอบสถานะของ response
          if (!response.ok) {
            throw new Error('การตอบกลับของเครือข่ายไม่ถูกต้อง')
          }
          // แปลง response เป็น JSON
          return response.json()
        })
        .then((data) => {
          // แปลงข้อมูลที่ได้รับให้เหลือเฉพาะค่าที่ต้องการ
          const transformedData = data.map((item) => ({
            // id: item.issue_id,
            // createDate: item.issue_create_date,
            // updateDate: item.issue_update_date,
            username: item.issue_notify_user_username,
            contact: item.issue_notify_user_contact,
            status: item.issue_status,
            type: item.issue_type,
            detail: item.issue_detail,
          }))
          // อัปเดตค่า items ด้วยข้อมูลที่แปลงแล้ว
          this.items = transformedData
        })
        .catch((error) => {
          // จัดการข้อผิดพลาดที่เกิดขึ้น
          console.error('เกิดปัญหาในการทำงาน fetch:', error)
        })
    }
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
})
</script>
