<template>
  <div>
    <h1 class="page-title">User</h1>
    <VaCard class="mb-5">
      <VaCardContent>
        <div class="flex justify-end">
          <VaSelect preset="small" class="w-24" />
        </div>
        <canvas id="column-chart"></canvas>
      </VaCardContent>
    </VaCard>
    <VaCard>
      <VaCardContent>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput v-model="filters.search" placeholder="Search">
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton icon="add" @click="showAddUserModal">User</VaButton>
        </div>

        <div class="va-table-responsive" style="max-height: 800px; overflow-y: auto">
          <table class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th style="font-size: 12px">Company</th>
                <th style="font-size: 12px">First Name</th>
                <th style="font-size: 12px">Last Name</th>
                <th style="font-size: 12px">Email</th>
                <th style="font-size: 12px">Role</th>
                <th style="font-size: 12px">Username</th>
                <!-- <th style="font-size: 12px">Password</th> -->
                <th style="font-size: 12px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(User, index) in paginatedUsers" :key="index">
                <td>{{ User.Company }}</td>
                <td>{{ User.Firstname }}</td>
                <td>{{ User.Lasttname }}</td>
                <td>{{ User.Email }}</td>
                <td>{{ User.Role }}</td>
                <td>{{ User.Username }}</td>
                <!-- <td>{{ User.Password }}</td> -->
                <td>
                  <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(User)" />
                  <VaButton preset="secondary" icon="mso-delete" color="danger" @click="deleteUser(User.id)" />
                  <RouterLink to="/user-token-detail">
                    <VaButton preset="secondary" icon="mso-info" color="secondary" @click="openModalUserCard(User)" />
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
          <div>
            <b>{{ paginatedUsers.length }} results.</b>
            Results per page
            <VaSelect v-model="perPage" class="!w-20" :options="[10, 50, 100]" />
          </div>

          <div v-if="totalPages > 1" class="flex">
            <VaButton
              preset="secondary"
              icon="va-arrow-left"
              aria-label="Previous page"
              :disabled="currentPage === 1"
              @click="previousPage"
            />
            <VaButton
              class="mr-2"
              preset="secondary"
              icon="va-arrow-right"
              aria-label="Next page"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            />
            <VaPagination
              v-model="currentPage"
              buttons-preset="secondary"
              :pages="totalPages"
              :visible-pages="5"
              :boundary-links="false"
              :direction-links="false"
            />
          </div>
        </div>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script>
import axios from 'axios'
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
      label: 'เพิ่มขึ้นในเดือนนี้',
      data: [50, 10, 22, 39, 15, 20, 85, 32, 60, 50, 20, 30],
      backgroundColor: 'rgba(21, 78, 193, 1)', // สีพื้นหลังแถบ
      borderColor: 'rgba(21, 78, 193, 1)', // สีเส้นขอบแถบ
      borderWidth: 1, // ความหนาของเส้นขอบแถบ
    },
    {
      label: 'ลดลงในเดือนนี้',
      data: [30, 5, 10, 16, 5, 10, 50, 12, 30, 25, 10, 15],
      backgroundColor: 'rgb(157, 38, 51)', // สีพื้นหลังแถบ
      borderColor: 'rgb(157, 38, 51)', // สีเส้นขอบแถบ
      borderWidth: 1, // ความหนาของเส้นขอบแถบ
    },
  ],
}

export default {
  data() {
    return {
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
  mounted() {
    this.renderChart()
  },
  created() {
    this.fetchData()
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
          this.Users = response.data.map((User) => ({
            id: User.User_id,
            Company: User.user_department,
            Firstname: User.user_first_name,
            Lasttname: User.user_last_name,
            Email: User.user_email,
            Role: User.user_access,
            Username: User.user_username,
            Password: User.user_password,
          }))
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

<style>
.company {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px 0;
}
th,
td {
  font-size: 12px;
}
.va-table {
  width: 100%;
}
.va-table tbody tr:not(:last-child) {
  border-bottom: 1px solid #dee5f2; /* เส้นคั่นระหว่างแถว */
}
.va-table thead th,
.va-table tbody tr:not(:last-child) {
  border-bottom: 1px solid #dee5f2; /* เส้นคั่นระหว่างแถว */
}
</style>
