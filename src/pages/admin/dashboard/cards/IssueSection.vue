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
      console.error('ไม่พบ access token ใน localStorage')
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
            throw new Error('การตอบกลับของเครือข่ายไม่ถูกต้อง')
          }
          // แปลง response เป็น JSON
          return response.json()
        })
        .then((data) => {
          // แปลงข้อมูลที่ได้รับให้เหลือเฉพาะค่าที่ต้องการ
          const transformedData = data.map((item) => ({
            type: item.issue_type,
            status: item.issue_status,
            detail: item.issue_detail,
          }))
          // อัปเดตค่า items ด้วยข้อมูลที่แปลงแล้ว
          this.items = transformedData
        })
        .catch((error) => {
          // จัดการข้อผิดพลาดที่เกิดขึ้น
          console.error('เกิดปัญหาในการทำงาน fetch:', error)
        })
    }
  },
})
</script>
