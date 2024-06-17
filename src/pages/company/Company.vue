<template>
  <div>
    <h1 class="page-title">Company</h1>
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
          <VaButton icon="add" @click="showAddCompanyModal">Add Company</VaButton>
        </div>

        <div class="va-table-responsive" style="max-height: 800px; overflow-y: auto">
          <table class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th style="font-size: 12px">Logo</th>
                <th style="font-size: 12px">Name</th>
                <th style="font-size: 12px">Address</th>
                <th style="font-size: 12px">Email</th>
                <th style="font-size: 12px">Phone</th>
                <th style="font-size: 12px">Contract Start Date</th>
                <th style="font-size: 12px">Expiration Date</th>
                <th style="font-size: 12px">Status</th>
                <th style="font-size: 12px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(company, index) in paginatedCompanies" :key="index">
                <td>{{ company.imageUrl }}</td>
                <td>{{ company.name }}</td>
                <td>{{ company.address }}</td>
                <td>{{ company.email }}</td>
                <td>{{ company.phone }}</td>
                <td>{{ company.createDate }}</td>
                <td>{{ company.updateDate }}</td>
                <td><VaBadge :text="company.status" :color="getStatusColor(company.status)" /></td>
                <td>
                  <VaButton
                    preset="secondary"
                    icon="mso-edit"
                    color="secondary"
                    @click="openEditCompanyCard(company)"
                  />
                  <VaButton
                    preset="secondary"
                    icon="mso-delete"
                    color="danger"
                    @click="deleteCompany(company.company_id)"
                  />
                  <VaButton
                    preset="secondary"
                    icon="mso-info"
                    color="secondary"
                    @click="infoCompany(company.company_id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
          <div>
            <b>{{ paginatedCompanies.length }} results.</b>
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

    <VaModal v-model="isAddCompanyModalOpen" title="Add Company" ok-text="Save" @ok="saveCompany">
      <VaForm class="flex flex-col gap-2">
        <VaInput v-model="company.name" label="Name" :rules="[required]" />
        <VaInput v-model="company.address" label="Address" :rules="[required]" />
        <VaInput v-model="company.email" label="Email" :rules="[required, emailRule]" />
        <VaInput v-model="company.phone" label="Phone" :rules="[required]" />
        <div class="flex flex-col gap-2">
          <div v-for="(subCompany, index) in company.subCompanies" :key="index" class="flex items-center gap-2">
            <VaInput v-model="subCompany.name" label="Sub Company" :rules="[required]" class="flex-grow" />
            <VaButton icon="delete" color="danger" @click="removeSubCompany(index)"></VaButton>
          </div>
          <VaButton icon="add" @click="addSubCompany">Add Sub Company</VaButton>
        </div>
      </VaForm>
    </VaModal>

    <VaModal v-model="isEditCompanyModalOpen" title="Edit Company" ok-text="Save" @ok="saveEditedCompany">
      <VaForm class="flex flex-col gap-2">
        <VaInput v-model="editedCompany.name" label="Name" :rules="[required]" />
        <VaInput v-model="editedCompany.address" label="Address" :rules="[required]" />
        <VaInput v-model="editedCompany.email" label="Email" :rules="[required, emailRule]" />
        <VaInput v-model="editedCompany.phone" label="Phone" :rules="[required]" />
        <div class="flex flex-col gap-2">
          <label>Sub Companies</label>
          <div v-for="(subCompany, index) in editedCompany.subCompanies" :key="index" class="flex items-center gap-2">
            <VaInput v-model="subCompany.name" label="Sub Company" :rules="[required]" class="flex-grow" />
            <VaButton icon="delete" color="danger" @click="removeEditedSubCompany(index)"></VaButton>
          </div>
          <VaButton icon="add" @click="addEditedSubCompany">Add Sub Company</VaButton>
        </div>
      </VaForm>
    </VaModal>
  </div>
</template>

<script>
import axios from 'axios'
import {
  VaButton,
  VaCard,
  VaCardContent,
  VaIcon,
  VaInput,
  VaPagination,
  VaSelect,
  VaForm,
  VaModal,
  VaBadge,
} from 'vuestic-ui'
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
  components: {
    VaButton,
    VaCard,
    VaCardContent,
    VaForm,
    VaIcon,
    VaInput,
    VaModal,
    VaPagination,
    VaSelect,
    VaBadge,
  },
  data() {
    return {
      selectedDMY: '',
      dmyOption: ['Daily', 'Monthly', 'Yearly'],
      chartData: columnChartData,
      chart: null,
      companies: [],
      loading: true,
      error: null,
      searchQuery: '', // ตัวแปร searchQuery เพื่อค้นหาข้อมูล
      perPage: 10,
      currentPage: 1,
      isAddCompanyModalOpen: false,
      isEditCompanyModalOpen: false,
      company: {
        name: '',
        address: '',
        email: '',
        phone: '',
        subCompanies: [{ name: '' }], // เริ่มต้นด้วย subCompany หนึ่งรายการ
      },
      editedCompany: {
        company_id: null,
        name: '',
        address: '',
        email: '',
        phone: '',
        subCompanies: [{ name: '' }], // เริ่มต้นด้วย subCompany หนึ่งรายการ
      },
      subCompanyOptions: [], // This should be populated with your options
      required: (value) => !!value || 'Required.',
      emailRule: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
    }
  },
  computed: {
    paginatedCompanies() {
      const startIndex = (this.currentPage - 1) * this.perPage
      const endIndex = startIndex + this.perPage
      return this.companies
        .filter((company) => {
          const searchText = this.searchQuery.toLowerCase().trim() // เปลี่ยนคำค้นหาเป็นตัวพิมพ์เล็กและตัดช่องว่าง
          const nameMatch = company.name.toLowerCase().includes(searchText) // ค้นหาในชื่อบริษัท
          const emailMatch = company.email.toLowerCase().includes(searchText) // ค้นหาในอีเมล
          const phoneMatch = company.phone.toLowerCase().includes(searchText) // ค้นหาในเบอร์มือถือ
          // คืนค่า true เมื่อมีการค้นหาตรงกับชื่อ Company, Firstname, หรือ Lastname
          return nameMatch || emailMatch || phoneMatch
        })
        .slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.companies.length / this.perPage)
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

    showAddCompanyModal() {
      this.isAddCompanyModalOpen = true
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
        .get(
          `http://89.213.177.27:8001/v1/owner/system_management/all_company/${encodeURIComponent(
            uri,
          )}?${searchParams.toString()}`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `${token}`,
            },
          },
        )
        .then((response) => {
          this.companies = response.data.map((company) => ({
            company_id: company.company_id,
            name: company.company_name,
            address: company.company_address,
            email: company.company_email,
            phone: company.company_phone,
            imageUrl: company.company_image_url,
            isDelete: company.company_is_delete,
            createDate: company.company_create_date,
            updateDate: company.company_update_date,
            expireDate: company.company_expire_date,
            isExpire: company.company_is_expire,
            status: company.company_status,
            sub_companies: company.company_sub_company_name.map((subCompanyName) => ({ id: '', name: subCompanyName })),
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

    deleteCompany(company_id) {
      const token = localStorage.getItem('access_token')
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'

      if (!company_id) {
        console.error('company_id is undefined or null')
        return
      }

      axios
        .delete(
          `http://89.213.177.27:8001/v1/owner/system_management/company/${company_id}/${encodeURIComponent(uri)}`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `${token}`,
            },
          },
        )
        .then(() => {
          this.companies = this.companies.filter((company) => company.company_id !== company_id)
        })
        .catch((error) => {
          console.error('Error deleting company:', error)
          // Handle error, show error message, etc.
        })
    },
    infoCompany(company_id) {
      this.$router.push({ name: 'company-token-detail', params: { _id: company_id } })
    },
    getStatusColor(status) {
      if (status === 'Active') {
        return 'success'
      } else if (status === 'Inactive') {
        return 'danger'
      } else {
        return 'primary'
      }
    },
    saveCompany() {
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      const token = localStorage.getItem('access_token')
      const subCompanyNames = this.company.subCompanies.map((sub) => sub.name) // เตรียมข้อมูลบริษัทลูก
      axios
        .post(
          `http://89.213.177.27:8001/v1/owner/system_management/company/${encodeURIComponent(uri)}`,
          {
            company_name: this.company.name,
            company_address: this.company.address,
            company_email: this.company.email,
            company_phone: this.company.phone,
            company_sub_company_name: subCompanyNames,
            company_create_date: new Date().toISOString(),
            company_update_date: new Date().toISOString(),
            company_expire_date: new Date().toISOString(),
            company_is_delete: false,
            company_is_expire: false,
            company_status: 'Active',
            company_image_url: 'string',
          },
          {
            headers: {
              accept: 'application/json',
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {
          // Handle success, maybe show a success message, update UI, etc.
          this.isAddCompanyModalOpen = false // Close the add modal after successful save
          this.fetchData() // Refresh data after save
        })
        .catch((error) => {
          console.error('Error saving company:', error)
          // Handle error, show error message, etc.
        })
    },

    openEditCompanyCard(company) {
      this.isEditCompanyModalOpen = true
      this.editedCompany = { ...company, subCompanies: company.sub_companies.map((sub) => ({ name: sub.name })) } // Clone company object to avoid modifying original data directly
    },

    saveEditedCompany() {
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      const token = localStorage.getItem('access_token')
      const subCompanyNames = this.editedCompany.subCompanies.map((sub) => sub.name) // เตรียมข้อมูลบริษัทลูก
      axios
        .put(
          `http://89.213.177.27:8001/v1/owner/system_management/company/${
            this.editedCompany.company_id
          }/${encodeURIComponent(uri)}`,
          {
            company_name: this.editedCompany.name,
            company_address: this.editedCompany.address,
            company_email: this.editedCompany.email,
            company_phone: this.editedCompany.phone,
            company_sub_company_name: subCompanyNames,
            company_create_date: this.editedCompany.createDate,
            company_update_date: new Date().toISOString(),
            company_expire_date: this.editedCompany.expireDate,
            company_is_delete: this.editedCompany.isDelete,
            company_is_expire: this.editedCompany.isExpire,
            company_status: this.editedCompany.status,
            company_image_url: this.editedCompany.imageUrl,
          },
          {
            headers: {
              accept: 'application/json',
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {
          this.isEditCompanyModalOpen = false // Close the edit modal after successful update
          this.fetchData() // Refresh data after update
        })
        .catch((error) => {
          console.error('Error updating company:', error)
          // Handle error, show error message, etc.
        })
    },

    addSubCompany() {
      this.company.subCompanies.push({ name: '' })
    },

    removeSubCompany(index) {
      this.company.subCompanies.splice(index, 1)
    },

    addEditedSubCompany() {
      this.editedCompany.subCompanies.push({ name: '' })
    },

    removeEditedSubCompany(index) {
      this.editedCompany.subCompanies.splice(index, 1)
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
.flex-grow {
  flex-grow: 1;
}
.sub-company-row {
  display: flex;
  align-items: flex-end; /* Align items to the bottom */
  gap: 10px; /* Adjust gap as needed */
}
.delete-button {
  height: 36px; /* Adjust this to match the height of the input */
}
</style>
