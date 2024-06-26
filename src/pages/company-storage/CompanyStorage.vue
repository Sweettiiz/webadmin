<template>
  <h1 class="page-title">Company Storage</h1>
  <div class="flex justify-between w-full">
    <div class="flex flex-col w-full h-full">
      <VaCard
        v-if="companies.length > 0"
        :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
        outlined
      >
        <VaCardContent class="flex flex-col mt-6 mb-5">
          <div class="flex flex-col items-center gap-4 grow">
            <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span>{{ currentCompany.name }}</span>
            </h4>
            <h6 class="va-h6 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
              <span class="text-[var(--va-secondary)]">Sub: </span>
              <span>{{ getSubCompanyNames }}</span>
            </h6>
            <p>
              <span class="text-[var(--va-secondary)]">Email: </span>
              <span>{{ currentCompany.email }}</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Phone: </span>
              <span>{{ currentCompany.phone }}</span>
            </p>
            <p>
              <span class="text-[var(--va-secondary)]">Address: </span>
              <span>{{ currentCompany.address }}</span>
            </p>
            <RouterLink to="/company-token">
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
      companies: [],
      loading: true,
      error: null,
      filters: {
        search: '',
      },
      perPage: 10,
      currentPage: 1,
      isAddCompanyModalOpen: false,
      isEditCompanyModalOpen: false,
      company: {
        name: '',
        address: '',
        email: '',
        phone: '',
        createDate: null,
        updateDate: null,
        subCompany: null,
      },
      editedCompany: {
        id: null,
        name: '',
        address: '',
        email: '',
        phone: '',
        createDate: null,
        updateDate: null,
        subCompany: null,
      },
      subCompanyOptions: [], // This should be populated with your options
      required: (value) => !!value || 'Required.',
      emailRule: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
    }
  },
  computed: {
    currentCompany() {
      // ใช้ company id จาก params ใน URL เพื่อหาข้อมูลบริษัทที่ตรงกับ id นี้
      const companyId = this.$route.params._id
      const foundCompany = this.companies.find((company) => company._id === companyId)
      if (foundCompany) {
        console.log('Current Company:', foundCompany) // ใส่ console.log() เพื่อตรวจสอบค่า currentCompany
        return foundCompany
      } else {
        console.error('Company not found')
        return {} // หรือค่าที่คุณต้องการจะส่งกลับเมื่อไม่พบบริษัท
      }
    },
    getSubCompanyNames() {
      // ถ้า currentCompany มี sub_companies
      if (this.currentCompany.sub_companies && this.currentCompany.sub_companies.length > 0) {
        // ใช้ map เพื่อเข้าถึงค่า name ของแต่ละ sub_company และรวมเป็น string
        return this.currentCompany.sub_companies.map((subCompany) => subCompany.name).join(', ')
      } else {
        return '' // หรือค่าที่ต้องการส่งกลับเมื่อไม่มี sub_companies
      }
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
  paginatedCompanies() {
    const startIndex = (this.currentPage - 1) * this.perPage
    const endIndex = startIndex + this.perPage
    return this.companies.slice(startIndex, endIndex)
  },
  totalPages() {
    return Math.ceil(this.companies.length / this.perPage)
  },
  created() {
    this.fetchData()
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
    showAddCompanyModal() {
      this.isAddCompanyModalOpen = true
    },
    fetchData() {
      const token = localStorage.getItem('access_token')
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      axios
      axios
        .get(`http://89.213.177.27:8001/v1/owner/system_management/all_company/${uri}`, {
          headers: {
            accept: 'application/json',
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          console.log(response.data) // ตรวจสอบข้อมูลที่ได้รับมา
          this.companies = response.data.map((company) => ({
            id: company.company_id,
            name: company.company_name,
            address: company.company_address,
            email: company.company_email,
            phone: company.company_phone,
            create_date: company.company_create_date,
            update_date: company.company_update_date,
            sub_companies: company.company_sub_company_name.map((subCompanyName) => ({ id: '', name: subCompanyName })),
          }))
          console.log(this.$route)
        })
        .catch((error) => {
          this.error = 'ไม่สามารถโหลดข้อมูลได้'
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteCompany(companyId) {
      const token = localStorage.getItem('access_token')
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      axios
        .delete(`http://89.213.177.27:8001/v1/owner/system_management/company/${company_id}/${uri}`, {
          headers: {
            accept: 'application/json',
            Authorization: `${token}`,
          },
        })
        .then(() => {
          this.companies = this.companies.filter((company) => company.id !== companyId)
        })
        .catch((error) => {
          console.error('Error deleting company:', error)
          // Handle error, show error message, etc.
        })
    },
    saveCompany() {
      // Logic to save company details
      this.$emit('save', this.company)
      this.isAddCompanyModalOpen = false
    },
    openEditCompanyCard(company) {
      this.isEditCompanyModalOpen = true
      this.editedCompany = { ...company } // Clone company object to avoid modifying original data directly
    },
    saveEditedCompany() {
      // const companyId = this.editedCompany.id
      const uri = 'mongodb://admin:adminpassword@89.213.177.27:27017/'
      const token = localStorage.getItem('access_token')
      axios
        .put(
          `http://89.213.177.27:8001/v1/owner/system_management/company/${company_id}/${uri}`,
          {
            company_name: this.editedCompany.name,
            company_address: this.editedCompany.address,
            company_email: this.editedCompany.email,
            company_phone: this.editedCompany.phone,
            company_sub_company_name: [this.editedCompany.subCompany],
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
          this.isEditCompanyModalOpen = false // Close the edit modal after successful update
          this.fetchData() // Refresh data after update
        })
        .catch((error) => {
          console.error('Error updating company:', error)
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
