<script lang="ts" setup>
import Company from './cards/CompanyTable.vue'
import User from './cards/UserTable.vue'
import TotalTokenUse from './cards/TotalTokenUse.vue'
import TokenStorage from './cards/TokenStorage.vue'
import IssueSection from './cards/IssueSection.vue'
import Prediction from './cards/Prediction.vue'
</script>

<template>
  <h1 class="page-title font-bold">Dashboard</h1>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <TotalTokenUse class="w-5/6 sm:w-[70%]" />
      <div class="flex flex-col gap-4 w-full sm:w-[30%]">
        <TokenStorage class="h-full" />
        <Prediction />
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <User class="w-full md:w-1/2" />
      <IssueSection class="w-full md:w-1/2" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <Company class="flex flex-col w-full" />
    </div>
  </section>
</template>
