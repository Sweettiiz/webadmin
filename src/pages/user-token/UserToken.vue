<template>
  <div>
    <h1 class="page-title">User Token</h1>
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
          <VaButton icon="add" @click="showAddUserModal">User</VaButton>
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
                <!-- <th style="font-size: 12px">Password</th> -->
                <th style="font-size: 12px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(User, index) in paginatedUsers" :key="index">
                <td>{{ User.Company }}</td>
                <td>{{ User.Firstname }}</td>
                <td>{{ User.Lastname }}</td>
                <td>{{ User.Email }}</td>
                <td>{{ User.Role }}</td>
                <td>{{ User.Username }}</td>
                <!-- <td>{{ User.Password }}</td> -->
                <td>
                  <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(User)" />
                  <VaButton preset="secondary" icon="mso-delete" color="danger" @click="deleteUser(User.id)" />
                  <RouterLink :to="{ name: 'user-token-detail', params: { id: User.id } }">
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
    <VaModal v-model="isAddUserModalOpen" title="Add User" ok-text="Save" @ok="validate() && saveUser()">
      <!-- v-slot is error delete it for now-->
      <VaForm class="flex flex-col gap-2">
        <VaInput v-model="user.Company" label="Company" :rules="[required]" />
        <VaInput v-model="user.Firstname" label="Firstname" :rules="[required]" />
        <VaInput v-model="user.Lastname" label="Lastname" :rules="[required, emailRule]" />
        <VaInput v-model="user.Email" label="Email" :rules="[required]" />
        <VaInput v-model="user.Role" label="Role" :rules="[required]" />
        <VaInput v-model="user.Username" label="Username" :rules="[required]" />
      </VaForm>
    </VaModal>

    <VaModal v-model="isEditUserModalOpen" title="Edit User" ok-text="Save" @ok="validate() && saveEditedUser()">
      <!-- v-slot is error delete it for now-->
      <VaForm class="flex flex-col gap-2">
        <VaInput v-model="editedUser.Company" label="Company" :rules="[required]" />
        <VaInput v-model="editedUser.Firstname" label="Firstname" :rules="[required]" />
        <VaInput v-model="editedUser.Lastname" label="Lastname" :rules="[required, emailRule]" />
        <VaInput v-model="editedUser.Email" label="Email" :rules="[required]" />
        <VaInput v-model="editedUser.Role" label="Role" :rules="[required]" />
        <VaInput v-model="editedUser.Username" label="Username" :rules="[required]" />
      </VaForm>
    </VaModal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
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
      },
      editedUser: {
        id: null,
        Company: '',
        Firstname: '',
        Lastname: '',
        Email: '',
        Role: '',
        Username: '',
      },
    }
  },
  computed: {
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.perPage
      const endIndex = startIndex + this.perPage
      return this.Users.filter((user) => {
        const searchText = this.searchQuery.toLowerCase().trim() // เปลี่ยนคำค้นหาเป็นตัวพิมพ์เล็กและตัดช่องว่าง
        const companyMatch = user.Company.toLowerCase().includes(searchText) // ค้นหาในชื่อบริษัท
        const firstnameMatch = user.Firstname.toLowerCase().includes(searchText) // ค้นหาในชื่อจริง
        const lastnameMatch = user.Lastname.toLowerCase().includes(searchText) // ค้นหาในนามสกุล
        const emailMatch = user.Email.toLowerCase().includes(searchText) // ค้นหาในนามสกุล
        const roleMatch = user.Role.toLowerCase().includes(searchText) // ค้นหาในนามสกุล
        const usernameMatch = user.Username.toLowerCase().includes(searchText) // ค้นหาในนามสกุล
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
  },
  created() {
    this.fetchData()
  },
  methods: {
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
            id: User.User_id,
            Company: User.user_department,
            Firstname: User.user_first_name,
            Lastname: User.user_last_name,
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
    saveUser() {
      // Logic to save company details
      this.$emit('save', this.user)
      this.isAddUserModalOpen = false
    },
    openEditUserCard(User) {
      this.isEditUserModalOpen = true
      this.editedUser = { ...User } // Clone User object to avoid modifying original data directly
    },
    saveEditedUser() {
      // const userId = this.editedUser.id
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      const token = localStorage.getItem('access_token')
      axios
        .put(
          `http://89.213.177.27:8001/v1/owner/system_management/user/${user_id}/${uri}`,
          {
            user_Company: this.editedUser.Company,
            user_Firstname: this.editedUser.Firstname,
            user_Lastname: this.editedUser.Lastname,
            user_Email: this.editedUser.Email,
            user_Role: this.editedUser.Role,
            user_Username: this.editedUser.Username,
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
          // Handle success, maybe show a success message, update UI, etc.
          this.isEditUserModalOpen = false // Close the edit modal after successful update
          this.fetchData() // Refresh data after update
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
        .delete(`http://89.213.177.27:8001//v1/owner/system_management/user/${user_id}/${uri}`, {
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
