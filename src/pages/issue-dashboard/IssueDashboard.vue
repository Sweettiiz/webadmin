<template>
  <h1 class="page-title">Issue Dashboard</h1>
  <VaCard>
    <VaCardContent>
      <VaSelect preset="small" class="w-24" />
      <div class="flex-col w-full mt-5">
        <p>Type 1</p>
        <VaProgressBar model-value="50" class="flex-col mb-5"></VaProgressBar>
        <p>Type 2</p>
        <VaProgressBar model-value="70" class="flex-col mb-5"></VaProgressBar>
      </div>
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
            // id: item.issue_id,
            // createDate: item.issue_create_date,
            // updateDate: item.issue_update_date,
            username: item.issue_notify_user_username,
            contact: item.issue_notify_user_contact,
            status: item.issue_status,
            type: item.issue_type,
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
