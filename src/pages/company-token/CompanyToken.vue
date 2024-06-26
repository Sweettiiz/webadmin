<template>
  <div>
    <h1 class="page-title">Company Token</h1>
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
          <VaButton icon="add" @click="showAddCompanyModal">Company</VaButton>
        </div>

        <div class="va-table-responsive" style="max-height: 800px; overflow-y: auto">
          <table class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th style="font-size: 12px">Name</th>
                <th style="font-size: 12px">Address</th>
                <th style="font-size: 12px">Email</th>
                <th style="font-size: 12px">Phone</th>
                <th style="font-size: 12px">Contract Start Date</th>
                <th style="font-size: 12px">Expiration Date</th>
                <th style="font-size: 12px">SubCompany</th>
                <th style="font-size: 12px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(company, index) in paginatedCompanies" :key="index">
                <td>{{ company.name }}</td>
                <td>{{ company.address }}</td>
                <td>{{ company.email }}</td>
                <td>{{ company.phone }}</td>
                <td>{{ company.create_date }}</td>
                <td>{{ company.update_date }}</td>
                <td>
                  <ul>
                    <li v-for="subCompany in company.sub_companies" :key="subCompany.id">
                      {{ subCompany.name }}
                    </li>
                  </ul>
                </td>
                <td>
                  <VaButton
                    preset="secondary"
                    icon="mso-edit"
                    color="secondary"
                    @click="openEditCompanyCard(company)"
                  />
                  <VaButton preset="secondary" icon="mso-delete" color="danger" @click="deleteCompany(company.id)" />
                  <RouterLink :to="{ name: 'company-token-detail', params: { id: company.id } }">
                    <VaButton preset="secondary" icon="mso-info" color="secondary" />
                  </RouterLink>
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
    <VaModal v-model="isAddCompanyModalOpen" title="Add Company" ok-text="Save" @ok="validate() && saveCompany()">
      <!-- v-slot is error delete it for now-->
      <VaForm class="flex flex-col gap-2">
        <VaInput v-model="company.name" label="Name" :rules="[required]" />
        <VaInput v-model="company.address" label="Address" :rules="[required]" />
        <VaInput v-model="company.email" label="Email" :rules="[required, emailRule]" />
        <VaInput v-model="company.phone" label="Phone" :rules="[required]" />
        <VaInput v-model="company.subCompany" label="SubCompany" :rules="[required]" />
      </VaForm>
    </VaModal>

    <VaModal
      v-model="isEditCompanyModalOpen"
      title="Edit Company"
      ok-text="Save"
      @ok="validate() && saveEditedCompany()"
    >
      <!-- v-slot is error delete it for now-->
      <VaForm class="flex flex-col gap-2">
        <VaInput v-model="editedCompany.name" label="Name" :rules="[required]" />
        <VaInput v-model="editedCompany.address" label="Address" :rules="[required]" />
        <VaInput v-model="editedCompany.email" label="Email" :rules="[required, emailRule]" />
        <VaInput v-model="editedCompany.phone" label="Phone" :rules="[required]" />
        <VaInput v-model="editedCompany.subCompany" label="SubCompany" :rules="[required]" />
      </VaForm>
    </VaModal>
  </div>
</template>

<script>
import axios from 'axios'
import { VaButton, VaCard, VaCardContent, VaIcon, VaInput, VaPagination, VaSelect } from 'vuestic-ui'
import { VaForm, VaModal } from 'vuestic-ui'

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
  },
  data() {
    return {
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
  },
  created() {
    this.fetchData()
  },
  methods: {
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
        .get(`http://89.213.177.27:8001/v1/owner/system_management/all_company/${uri}?${searchParams.toString()}`, {
          headers: {
            accept: 'application/json',
            Authorization: `${token}`,
          },
        })
        .then((response) => {
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
