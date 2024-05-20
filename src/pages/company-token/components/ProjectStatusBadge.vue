<script setup lang="ts">
import { PropType } from 'vue'
import { Project } from '../types'

defineProps({
  status: {
    type: String as PropType<Project['status']>,
    required: true,
  },
})

const badgeColorMap: Record<Project['status'], string> = {
  active: 'success',
  archived: 'secondary',
  completed: 'success',
  important: 'warning',
}
</script>

<template>
  <VaBadge square :color="badgeColorMap[$props.status]" :text="$props.status.toUpperCase()" />
</template>
