<template>
  <VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
    <template #left>
      <VaLayout class="h-full" style="width: 50vw">
        <VaCard
          class="flex flex-col h-30 w-40 ml-[15rem] mt-[10rem] items-center justify-start"
          :style="{
            '--va-card-outlined-border': '5px var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Companys</p>
              <p class="va-arrow-up">14</p>
            </div>
          </VaCardContent>
        </VaCard>
        <img src="/public/human.png" alt="human" width="600" class="flex flex-col ml-[20rem] mt-[-7rem]" />
        <VaCard
          class="flex flex-col h-30 w-40 ml-[15rem] mt-[-5rem] items-center justify-between"
          :style="{
            '--va-card-outlined-border': '5px var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
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
          class="flex flex-col h-30 w-40 ml-[50rem] mt-[-30rem] items-center justify-end"
          :style="{
            '--va-card-outlined-border': '5px  var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Tokens</p>
              <p class="va-arrow-up">100,000</p>
            </div>
          </VaCardContent>
        </VaCard>
      </VaLayout>
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
            <RouterView />
          </div>
        </main>
      </div>
    </template>
  </VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'

const breakpoint = useBreakpoint()
</script>
