<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    // ดึง access token จาก localStorage
    const accessToken = localStorage.getItem('access_token')

    // ตรวจสอบว่ามี access token หรือไม่
    if (!accessToken) {
      console.error('Access token not found in localStorage')
    } else {
      // สร้าง Header สำหรับการส่ง request
      const headers = {
        Accept: 'application/json',
        Authorization: accessToken,
      }

      // ทำ GET request โดยใช้ fetch API
      fetch('http://89.213.177.27:8001/v1/owner/system_management/issue/', {
        method: 'GET',
        headers: headers,
      })
        .then((response) => {
          // ตรวจสอบสถานะของ response
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          // แปลง response เป็น JSON
          return response.json()
        })
        .then((data) => {
          // อัปเดตค่า items ด้วยข้อมูลที่ได้รับ
          this.items = data
        })
        .catch((error) => {
          // จัดการข้อผิดพลาดที่เกิดขึ้น
          console.error('There was a problem with the fetch operation:', error)
        })
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
            <!-- <VaButton>Date</VaButton>
            <VaButton>Week</VaButton>
            <VaButton>Month</VaButton> -->
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
