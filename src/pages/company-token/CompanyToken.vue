<template>
  <h1 class="page-title">Company Token</h1>
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
      </div>

      <div class="va-table-responsive" style="max-height: 800px; overflow-y: auto">
        <table class="va-table va-table--hoverable">
          <thead>
            <tr>
              <th style="font-size: 12px">Name</th>
              <th style="font-size: 12px">Address</th>
              <th style="font-size: 12px">Email</th>
              <th style="font-size: 12px">Phone</th>
              <th style="font-size: 12px">Create date</th>
              <th style="font-size: 12px">Update date</th>
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
                <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditCompanyCard(company)" />
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
import { VaButton, VaCard, VaCardContent, VaIcon, VaInput, VaPagination, VaSelect } from 'vuestic-ui'

export default {
  components: {
    VaButton,
    VaCard,
    VaCardContent,
    VaIcon,
    VaInput,
    VaPagination,
    VaSelect,
  },
  data() {
    return {
      companies: [
        {
          name: 'ABC Company',
          address: '123 Main St, City, Country',
          email: 'abc@example.com',
          phone: '123-456-7890',
          create_date: '2024-05-31',
          update_date: '2024-05-31',
          sub_companies: [
            { id: 1, name: 'Subcompany A1' },
            { id: 2, name: 'Subcompany A2' },
          ],
        },
        {
          name: 'XYZ Inc.',
          address: '456 Elm St, City, Country',
          email: 'xyz@example.com',
          phone: '987-654-3210',
          create_date: '2024-05-30',
          update_date: '2024-05-30',
          sub_companies: [
            { id: 3, name: 'Subcompany B1' },
            { id: 4, name: 'Subcompany B2' },
          ],
        },
        {
          name: 'EFG Corporation',
          address: '789 Oak St, City, Country',
          email: 'efg@example.com',
          phone: '555-555-5555',
          create_date: '2024-05-29',
          update_date: '2024-05-29',
          sub_companies: [
            { id: 5, name: 'Subcompany C1' },
            { id: 6, name: 'Subcompany C2' },
          ],
        },
        {
          name: 'HIJ Enterprises',
          address: '321 Pine St, City, Country',
          email: 'hij@example.com',
          phone: '999-999-9999',
          create_date: '2024-05-28',
          update_date: '2024-05-28',
          sub_companies: [
            { id: 7, name: 'Subcompany D1' },
            { id: 8, name: 'Subcompany D2' },
          ],
        },
        {
          name: 'LMN Ltd.',
          address: '555 Maple St, City, Country',
          email: 'lmn@example.com',
          phone: '777-777-7777',
          create_date: '2024-05-27',
          update_date: '2024-05-27',
          sub_companies: [
            { id: 9, name: 'Subcompany E1' },
            { id: 10, name: 'Subcompany E2' },
          ],
        },
      ],
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
  methods: {},
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
}
</script>
