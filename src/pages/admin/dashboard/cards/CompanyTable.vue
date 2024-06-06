<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Total Company</h1>
    </VaCardTitle>
    <VaCardContent class="flex flex-col gap-1">
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <!-- <VaButton icon="add" @click="showAddCompanyModal">Company</VaButton> -->
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
              <th style="font-size: 12px">Status</th>
              <th style="font-size: 12px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(company, index) in paginatedCompanies" :key="index">
              <td>{{ company.name }}</td>
              <td>{{ company.address }}</td>
              <td>{{ company.email }}</td>
              <td>{{ company.phone }}</td>
              <td>{{ company.contract_state_date }}</td>
              <td>{{ company.expirationdate }}</td>
              <td>
                <VaBadge text="active" color="success" />
              </td>
              <td>
                <VaButton preset="secondary" icon="mso-info" color="secondary" @click="openModalCompanyCard(User)" />
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
</template>

<script>
import axios from 'axios'
import { VaButton, VaCard, VaCardContent, VaPagination, VaSelect, VaBadge } from 'vuestic-ui'
// import { VaForm, VaModal, VaIcon, VaInput} from 'vuestic-ui'

export default {
  components: {
    VaButton,
    VaCard,
    VaCardContent,
    // VaForm,
    // VaIcon,
    // VaInput,
    // VaModal,
    VaPagination,
    VaSelect,
    VaBadge,
  },
  data() {
    return {
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
    paginatedCompanies() {
      const startIndex = (this.currentPage - 1) * this.perPage
      const endIndex = startIndex + this.perPage
      return this.companies.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.companies.length / this.perPage)
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
.status-active {
  border: 2px solid green;
  padding: 4px;
  display: inline-block;
  border-radius: 4px;
}
</style>
