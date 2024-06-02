<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Issue Dashboard</h1>
    </VaCardTitle>
    <VaCardContent>
      <section class="flex flex-col gap-4 mt-5">
        <div class="flex flex-col gap-4">
          <VaDataTable :items="items" />
        </div>
      </section>
    </VaCardContent>
  </VaCard>
</template>

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
      fetch('http://89.213.177.27:8001/v1/owner/system_management/issue_owner', {
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
