<script setup lang="ts">
import { PropType } from 'vue'
import { Company } from '../CompanyTypes'

defineProps({
  status: {
    type: String as PropType<Company['status']>,
    required: true,
  },
})

const badgeColorMap: Record<Company['status'], string> = {
  active: 'success',
  inactive: 'danger',
}
</script>

<template>
  <VaBadge square :color="badgeColorMap[$props.status]" :text="$props.status.toUpperCase()" />
</template>
