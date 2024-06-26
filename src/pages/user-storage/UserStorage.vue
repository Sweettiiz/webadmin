<template>
  <h1 class="page-title">User Storage</h1>
  <div class="flex justify-between w-full">
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
            <RouterLink to="/user-token">
              <VaButton preset="secondary" icon="mso-info" color="secondary" />
            </RouterLink>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col h-full">
      <VaCard :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }" outlined>
        <VaCardContent class="mt-2">
          <div class="flex justify-end">
            <VaSelect v-model="selectedDMY" :options="dmyOption" placeholder="select" preset="small" class="w-24" />
          </div>
          <canvas id="pie-chart"></canvas>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
  <div class="flex justify-between">
    <div class="flex flex-col w-full h-full">
      <VaCard :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }" outlined>
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
import axios from 'axios'

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
      selectedDMY: '',
      dmyOption: ['Daily', 'Monthly', 'Yearly'],
      chartData: usageAndRemainingData,
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
