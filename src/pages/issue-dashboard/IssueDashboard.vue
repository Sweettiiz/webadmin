<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    const items = [
      {
        Date: '15/04/2024',
        Type: 'Type 1',
        Detail: 'ไม่สามารถลบ Audit Project ได้',
        Status: 'แก้ไขแล้ว',
      },
      {
        Date: '20/03/2024',
        Type: 'Type 2',
        Detail: 'ไม่สามารถดูจำนวน Token ทั้งหมดที่ใช้ไป',
        Status: 'แก้ไขแล้ว',
      },
      {
        Date: '7/05/2024',
        Type: 'Type 3',
        Detail: 'ไม่สามารถดูจำนวน Users ที่อยู่บริษัทเดียวกัน',
        Status: 'ยังไม่แก้ไข',
      },
      {
        Date: '9/05/2024',
        Type: 'Type 4',
        Detail: 'ไม่สามารถรับการแจ้งเตือนของ Notification ',
        Status: 'ยังไม่แก้ไข',
      },
      {
        Date: '12/04/2024',
        Type: 'Type 5',
        Detail: 'ไม่สามารถขอจำนวน Token เพิ่มได้',
        Status: 'แก้ไขแล้ว',
      },
    ]

    return {
      items,
    }
  },
})
</script>

<template>
  <h1 class="page-title">Issue Dashboard</h1>
  <VaCard>
    <VaCardContent>
      <section class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <VaButtonGroup class="flex-col gap-5">
            <VaButton>Date</VaButton>
            <VaButton>Week</VaButton>
            <VaButton>Month</VaButton>
          </VaButtonGroup>
          <div class="flex-col w-full">
            <p>Type 1</p>
            <VaProgressBar model-value="50" class="flex-col"></VaProgressBar>
            <p>Type 2</p>
            <VaProgressBar model-value="60" class="flex-col"></VaProgressBar>
            <p>Type 3</p>
            <VaProgressBar model-value="40" class="flex-col"></VaProgressBar>
            <p>Type 4</p>
            <VaProgressBar model-value="20" class="flex-col"></VaProgressBar>
            <p>Type 5</p>
            <VaProgressBar model-value="70" class="flex-col"></VaProgressBar>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <VaDataTable :items="items" />
        </div>
      </section>
    </VaCardContent>
  </VaCard>
</template>
