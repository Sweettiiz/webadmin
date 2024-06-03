<template>
  <VaIcon name="mso-account_circle" :size="50" />
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">{{ store.userName }}</h2>
    <div class="flex space-x-1 text-[13px] leading-4"></div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '../../../stores/user-store'

const store = useUserStore()
</script>
