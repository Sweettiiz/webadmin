<template>
  <h1 class="page-title">User Token</h1>

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
              <th style="font-size: 12px">Company</th>
              <th style="font-size: 12px">First Name</th>
              <th style="font-size: 12px">Last Name</th>
              <th style="font-size: 12px">Email</th>
              <th style="font-size: 12px">Role</th>
              <th style="font-size: 12px">Username</th>
              <th style="font-size: 12px">Password</th>
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
              <td>{{ User.Password }}</td>
              <td>
                <RouterLink to="/user-token-detail">
                  <VaButton preset="secondary" icon="mso-edit" color="secondary" @click="openEditUserCard(User)" />
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
      Users: [
        {
          Company: 'ABC Company',
          Firstname: 'John',
          Lastname: 'Doe',
          Email: 'john.doe@example.com',
          Role: 'Admin',
          Username: 'johndoe',
          Password: 'password123',
        },
        {
          Company: 'XYZ Corporation',
          Firstname: 'Jane',
          Lastname: 'Smith',
          Email: 'jane.smith@example.com',
          Role: 'User',
          Username: 'janesmith',
          Password: 'pass123',
        },
        {
          Company: '123 Inc.',
          Firstname: 'Michael',
          Lastname: 'Johnson',
          Email: 'michael.johnson@example.com',
          Role: 'Admin',
          Username: 'michaelj',
          Password: 'qwerty',
        },
        {
          Company: 'Tech Solutions Ltd.',
          Firstname: 'Emily',
          Lastname: 'Brown',
          Email: 'emily.brown@example.com',
          Role: 'User',
          Username: 'emilyb',
          Password: 'brownie',
        },
        {
          Company: 'Global Industries',
          Firstname: 'David',
          Lastname: 'Wilson',
          Email: 'david.wilson@example.com',
          Role: 'Admin',
          Username: 'davidw',
          Password: 'wilson123',
        },
      ],
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
  methods: {
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
