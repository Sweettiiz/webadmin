<template>
  <VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
    <template #left>
      <RouterLink class="h-full" style="width: 50vw" to="/" aria-label="Visit homepage">
        <VaCard
          class="flex flex-col h-30 w-40 ml-[3rem] mt-[3rem] items-center justify-start"
          :style="{ '--va-card-outlined-border': '5px solid var(--va-background-element)' }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Companys</p>
              <p class="va-arrow-up">14</p>
            </div>
          </VaCardContent>
        </VaCard>
        <VaCard
          class="flex flex-col h-30 w-40 ml-[3rem] mt-[15rem] items-center justify-between"
          :style="{ '--va-card-outlined-border': '5px solid var(--va-background-element)' }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Users</p>
              <p class="va-arrow-up">3,652</p>
            </div>
          </VaCardContent>
        </VaCard>
        <VaCard
          class="flex flex-col h-30 w-40 ml-[45rem] mt-[20rem] items-center justify-end"
          :style="{ '--va-card-outlined-border': '5px solid var(--va-background-element)' }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Tokens</p>
              <p class="va-arrow-up">100,000</p>
            </div>
          </VaCardContent>
        </VaCard>
        <!-- <VuesticLogo :height="28" start="#FFF" /> -->
      </RouterLink>
    </template>
    <template #content>
      <main class="h-full flex items-center justify-center mx-auto max-w-[420px]">
        <RouterView />
      </main>
    </template>
  </VaLayout>

  <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
    <template #content>
      <div class="p-4">
        <main class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]">
          <div class="flex flex-col items-start">
            <RouterLink class="py-4" to="/" aria-label="Visit homepage">
              <VuesticLogo class="mb-2" start="#0E41C9" />
            </RouterLink>
            <RouterView />
          </div>
        </main>
      </div>
    </template>
  </VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'
import VuesticLogo from '../components/VuesticLogo.vue'

const breakpoint = useBreakpoint()
</script>
