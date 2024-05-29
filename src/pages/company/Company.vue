<template>
  <div>
    <h1 class="page-title">Company</h1>

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
          <VaButton icon="add" @click="showAddUserModal">Company</VaButton>
        </div>

        <div class="va-table-responsive" style="max-height: 800px; overflow-y: auto;">
          <table class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th style="font-size: 12px;">Name</th>
                <th style="font-size: 12px;">Address</th>
                <th style="font-size: 12px;">Email</th>
                <th style="font-size: 12px;">Phone</th>
                <th style="font-size: 12px;">Create date</th>
                <th style="font-size: 12px;">Update date</th>
                <th style="font-size: 12px;">SubCompany</th>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      companies: [],
      loading: true,
      error: null,
      filters: {
        search: ''
      },
      perPage: 10,
      currentPage: 1
    };
  },
  computed: {
    paginatedCompanies() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.companies.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.companies.length / this.perPage);
    }
  },
  methods: {
    showAddUserModal() {
      // Implement your logic here
    },
    fetchData() {
      const token = localStorage.getItem('access_token');
      axios.get('http://89.213.177.27:8001/v1/owner/system_management/company/', {
        headers: {
          'accept': 'application/json',
          'Authorization': `${token}`
        }
      })
      .then(response => {
        this.companies = response.data.map(company => ({
          id: company.company_id,
          name: company.company_name,
          address: company.company_address,
          email: company.company_email,
          phone: company.company_phone,
          create_date: company.company_create_date,
          update_date: company.company_update_date,
          sub_companies: company.company_sub_company_name.map(subCompanyName => ({ id: '', name: subCompanyName }))
        }));
      })
      .catch(error => {
        this.error = 'ไม่สามารถโหลดข้อมูลได้';
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  created() {
    this.fetchData();
  }
};
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
    border-bottom: 1px solid #DEE5F2; /* เส้นคั่นระหว่างแถว */
}
.va-table thead th,
.va-table tbody tr:not(:last-child) {
    border-bottom: 1px solid #DEE5F2; /* เส้นคั่นระหว่างแถว */
}

</style>
   