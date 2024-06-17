<template>
  <div>
    <h1 class="page-title">User</h1>
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
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput v-model="searchQuery" placeholder="Search">
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton icon="add" @click="showAddUserModal">Add User</VaButton>
        </div>

        <div class="va-table-responsive" style="max-height: 800px; overflow-y: auto">
          <table class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th style="font-size: 12px">Company</th>
                <th style="font-size: 12px">FirstName</th>
                <th style="font-size: 12px">LastName</th>
                <th style="font-size: 12px">Email</th>
                <th style="font-size: 12px">Role</th>
                <th style="font-size: 12px">Username</th>
                <th style="font-size: 12px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in paginatedUsers" :key="index">
                <td>{{ user.Company }}</td>
                <td>{{ user.Firstname }}</td>
                <td>{{ user.Lastname }}</td>
                <td>{{ user.Email }}</td>
                <td>{{ user.Role }}</td>
                <td>{{ user.Username }}</td>
                <td>
                  <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(user)" />
                  <VaButton preset="secondary" icon="mso-delete" color="danger" @click="deleteUser(user.id)" />
                  <RouterLink :to="{ name: 'user-token-detail', params: { id: user.id } }">
                    <VaButton preset="secondary" icon="mso-info" color="secondary" />
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

    <VaModal v-model="isAddUserModalOpen" title="Add User" ok-text="Save" @ok="saveUser()">
      <VaForm ref="addForm" class="flex flex-col gap-2">
        <VaInput v-model="user.Company" label="Company" :rules="[required]" />
        <VaInput v-model="user.Firstname" label="Firstname" :rules="[required]" />
        <VaInput v-model="user.Lastname" label="Lastname" :rules="[required]" />
        <VaInput v-model="user.Email" label="Email" :rules="[required, emailRule]" />
        <VaInput v-model="user.Role" label="Role" :rules="[required]" />
        <VaInput v-model="user.Username" label="Username" :rules="[required]" />
        <VaInput v-model="user.Password" label="Password" :rules="[required]" type="password" />
        <VaInput v-model="user.Department" label="Department" :rules="[required]" />
        <VaInput v-model="user.ImageUrl" label="Image URL" />
      </VaForm>
    </VaModal>

    <VaModal v-model="isEditUserModalOpen" title="Edit User" ok-text="Save" @ok="saveEditedUser()">
      <VaForm ref="editForm" class="flex flex-col gap-2">
        <VaInput v-model="editedUser.Company" label="Company" :rules="[required]" />
        <VaInput v-model="editedUser.Firstname" label="Firstname" :rules="[required]" />
        <VaInput v-model="editedUser.Lastname" label="Lastname" :rules="[required]" />
        <VaInput v-model="editedUser.Email" label="Email" :rules="[required, emailRule]" />
        <VaInput v-model="editedUser.Role" label="Role" :rules="[required]" />
        <VaInput v-model="editedUser.Username" label="Username" :rules="[required]" />
        <VaInput v-model="editedUser.Password" label="Password" :rules="[required]" type="password" />
        <VaInput v-model="editedUser.Department" label="Department" :rules="[required]" />
        <VaInput v-model="editedUser.ImageUrl" label="Image URL" />
      </VaForm>
    </VaModal>
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
      borderRadius: 10, // ความโค้งมนของเส้นขอบแถบ
      barThickness: 10, // ความหนาของเส้น
    },
    {
      label: 'ลดลงในเดือนนี้',
      data: [30, 5, 10, 16, 5, 10, 50, 12, 30, 25, 10, 15],
      backgroundColor: 'rgb(157, 38, 51)', // สีพื้นหลังแถบ
      borderColor: 'rgb(157, 38, 51)', // สีเส้นขอบแถบ
      borderWidth: 1, // ความหนาของเส้นขอบแถบ
      borderRadius: 10, // ความโค้งมนของเส้นขอบแถบ
      barThickness: 10, // ความหนาของเส้น
    },
  ],
}

export default {
  data() {
    return {
      selectedDMY: '',
      dmyOption: ['Daily', 'Monthly', 'Yearly'],
      chartData: columnChartData,
      chart: null,
      Users: [],
      loading: true,
      error: null,
      searchQuery: '', // ตัวแปร searchQuery เพื่อค้นหาข้อมูล
      perPage: 10,
      currentPage: 1,
      isAddUserModalOpen: false,
      isEditUserModalOpen: false,
      user: {
        Company: '',
        Firstname: '',
        Lastname: '',
        Email: '',
        Role: '',
        Username: '',
        Password: '', // เพิ่มฟิลด์ Password
        Department: '',
        ImageUrl: '',
      },
      editedUser: {
        id: null,
        Company: '',
        Firstname: '',
        Lastname: '',
        Email: '',
        Role: '',
        Username: '',
        Password: '', // เพิ่มฟิลด์ Password
        Department: '',
        ImageUrl: '',
      },
      required: (value) => !!value || 'This field is required',
      emailRule: (value) => /\S+@\S+\.\S+/.test(value) || 'Email must be valid',
    }
  },
  computed: {
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.perPage
      const endIndex = startIndex + this.perPage
      // ใช้ filter เพื่อค้นหาข้อมูลที่ตรงกับเงื่อนไขที่ระบุ
      return this.Users.filter((user) => {
        const searchText = this.searchQuery.toLowerCase().trim() // เปลี่ยนคำค้นหาเป็นตัวพิมพ์เล็กและตัดช่องว่าง
        const companyMatch = user.Company && user.Company.toLowerCase().includes(searchText)
        const firstnameMatch = user.Firstname && user.Firstname.toLowerCase().includes(searchText)
        const lastnameMatch = user.Lastname && user.Lastname.toLowerCase().includes(searchText)
        const emailMatch = user.Email && user.Email.toLowerCase().includes(searchText)
        const roleMatch = user.Role && user.Role.toLowerCase().includes(searchText)
        const usernameMatch = user.Username && user.Username.toLowerCase().includes(searchText)
        // คืนค่า true เมื่อมีการค้นหาตรงกับชื่อ Company, Firstname, หรือ Lastname
        return companyMatch || firstnameMatch || lastnameMatch || emailMatch || roleMatch || usernameMatch
      }).slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.Users.length / this.perPage)
    },
  },
  watch: {
    searchQuery() {
      // เมื่อมีการเปลี่ยนแปลงใน searchQuery ให้ currentPage เป็น 1
      this.currentPage = 1
    },
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
      this.isAddUserModalOpen = true
    },
    fetchData() {
      const token = localStorage.getItem('access_token')
      const searchText = this.searchQuery.trim().toLowerCase() // เปลี่ยนคำค้นหาเป็นตัวพิมพ์เล็กและตัดช่องว่าง
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      const searchParams = new URLSearchParams() // สร้าง URLSearchParams เพื่อจัดการพารามิเตอร์ใน URL
      if (searchText) {
        // หากมีการค้นหาเข้ามา ให้เพิ่มพารามิเตอร์ search ใน URLSearchParams
        searchParams.append('search', searchText)
      }
      axios
        .get(`http://89.213.177.27:8001/v1/owner/system_management/all_user/${uri}?${searchParams.toString()}`, {
          headers: {
            accept: 'application/json',
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          this.Users = response.data.map((User) => ({
            id: User.user_id,
            Company: User.user_company,
            Firstname: User.user_first_name,
            Lastname: User.user_last_name,
            Email: User.user_email,
            Role: User.user_access,
            Username: User.user_username,
            Password: User.user_password,
            Department: User.user_department,
            ImageUrl: User.user_image_url,
            IsDelete: User.user_is_delete,
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
    saveUser() {
      const token = localStorage.getItem('access_token')
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      axios
        .post(
          `http://89.213.177.27:8001/v1/owner/system_management/user/${uri}`,
          {
            user_company: this.user.Company,
            user_first_name: this.user.Firstname,
            user_last_name: this.user.Lastname,
            user_email: this.user.Email,
            user_access: this.user.Role,
            user_username: this.user.Username,
            user_password: this.user.Password,
            user_department: this.user.Department,
            user_image_url: this.user.ImageUrl,
            user_is_delete: false,
          },
          {
            headers: {
              accept: 'application/json',
              Authorization: token,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {
          this.fetchData() // Refresh data after adding user
          this.isAddUserModalOpen = false // Close the add user modal
        })
        .catch((error) => {
          console.error('Error adding user:', error)
          // Handle error, show error message, etc.
        })
    },
    openEditUserCard(user) {
      this.isEditUserModalOpen = true
      this.editedUser = { ...user } // Clone user object to avoid modifying original data directly
    },
    saveEditedUser() {
      const userId = this.editedUser.id
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      const token = localStorage.getItem('access_token')
      axios
        .put(
          `http://89.213.177.27:8001/v1/owner/system_management/user/${userId}/${uri}`,
          {
            user_company: this.editedUser.Company,
            user_first_name: this.editedUser.Firstname,
            user_last_name: this.editedUser.Lastname,
            user_email: this.editedUser.Email,
            user_access: this.editedUser.Role,
            user_username: this.editedUser.Username,
            user_password: this.editedUser.Password,
            user_department: this.editedUser.Department,
            user_image_url: this.editedUser.ImageUrl,
            user_is_delete: this.editedUser.IsDelete,
          },
          {
            headers: {
              accept: 'application/json',
              Authorization: token,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {
          this.fetchData() // Refresh data after update
          this.isEditUserModalOpen = false // Close the edit modal
        })
        .catch((error) => {
          console.error('Error updating user:', error)
          // Handle error, show error message, etc.
        })
    },
    deleteUser(userId) {
      const token = localStorage.getItem('access_token')
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      axios
        .delete(`http://89.213.177.27:8001/v1/owner/system_management/user/${userId}/${uri}`, {
          headers: {
            accept: 'application/json',
            Authorization: `${token}`,
          },
        })
        .then(() => {
          this.Users = this.Users.filter((user) => user.id !== userId)
        })
        .catch((error) => {
          console.error('Error deleting user:', error)
          // Handle error, show error message, etc.
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

<style scoped>
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
