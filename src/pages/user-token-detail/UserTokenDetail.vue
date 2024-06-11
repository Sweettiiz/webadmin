<template>
  <h1 class="page-title">User Token Detail</h1>
  <div class="flex justify-between">
    <div class="flex flex-col w-full h-full">
      <VaCard
        v-if="Users.length > 0"
        :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
        outlined
      >
        <VaCardContent class="flex flex-col">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span>{{ currentUser.Company }}</span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span>{{ currentUser.Firstname }} {{ currentUser.Lastname }}</span>
            </h6>
            <p>
              <span class="text-[var(--va-secondary)]">Email: </span>
              <span>{{ currentUser.Email }}</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Role: </span>
              <span class="va-text-bold">{{ currentUser.Role }}</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Username: </span>
              <span>{{ currentUser.Username }}</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Password: </span>
              <span>{{ currentUser.Password }}</span>
            </p>
            <RouterLink to="/user-storage">
              <VaButton preset="secondary" icon="mso-info" color="secondary" />
            </RouterLink>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col">
      <VaCard :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="flex flex-col">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> จำนวนการใช้งาน Token </span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span> 1,800 / 10,000 </span>
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
          <div class="flex justify-end">
            <VaSelect v-model="selectedDMY" :options="dmyOption" placeholder="select" preset="small" class="w-24" />
          </div>
          <canvas id="column-chart"></canvas>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { VaCard, VaCardContent } from 'vuestic-ui'
import axios from 'axios'

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
      borderRadius: 10, // ความโค้งมนของเส้นขอบแถบ
      barThickness: 10, // ความหนาของเส้น
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
      selectedDMY: '',
      dmyOption: ['Daily', 'Monthly', 'Yearly'],
      chartData: columnChartData,
      chart: null,
      Users: [],
      loading: true,
      error: null,
      filters: {
        search: '',
      },
      perPage: 10,
      currentPage: 1,
    }
  },
  computed: {
    currentUser() {
      // Find the company object in this.companies that matches the id
      const UserId = this.Users[0].id // Replace with this.companies[0].id
      return this.Users.find((User) => User.id === UserId) || {}
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.perPage
      const endIndex = startIndex + this.perPage
      return this.Users.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.Users.length / this.perPage)
    },
  },
  watch: {
    chartData() {
      this.chart.data.datasets.forEach((dataset, i) => {
        dataset.data = this.chartData.datasets[i].data
      })
      this.chart.update()
    },
  },
  created() {
    this.fetchData()
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
    showAddUserModal() {
      // Implement your logic here
    },
    fetchData() {
      const token = localStorage.getItem('access_token')
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      axios
        .get(`http://89.213.177.27:8001/v1/owner/system_management/all_user/${uri}`, {
          headers: {
            accept: 'application/json',
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          console.log(response.data) // ตรวจสอบข้อมูลที่ได้รับมา
          this.Users = response.data.map((User) => ({
            id: User.User_id,
            Company: User.user_department,
            Firstname: User.user_first_name,
            Lastname: User.user_last_name,
            Email: User.user_email,
            Role: User.user_access,
            Username: User.user_username,
            Password: User.user_password,
          }))
          console.log(this.Users[0].id)
        })
        .catch((error) => {
          this.error = 'ไม่สามารถโหลดข้อมูลได้'
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
  },
}
</script>
