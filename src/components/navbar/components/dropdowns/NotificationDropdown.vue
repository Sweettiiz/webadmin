<template>
  <VaDropdown :offset="[13, 0]" class="notification-dropdown" stick-to-edges :close-on-content-click="false">
    <template #anchor>
      <VaButton preset="secondary" color="textPrimary">
        <VaBadge overlap>
          <template #text> 2+</template>
          <VaIcon name="notifications" :size="24" />
        </VaBadge>
      </VaButton>
    </template>
    <VaDropdownContent class="h-full sm:max-w-[420px] sm:h-auto">
      <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <VaDataTable :items="items" />
        </div>
      </section>
    </VaDropdownContent>
  </VaDropdown>
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
            throw new Error('การตอบกลับของเครือข่ายไม่ถูกต้อง')
          }
          // แปลง response เป็น JSON
          return response.json()
        })
        .then((data) => {
          // แปลงข้อมูลที่ได้รับให้เหลือเฉพาะค่าที่ต้องการ
          const transformedData = data.map((item) => ({
            detail: item.issue_detail,
            status: item.issue_status,
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

<style lang="scss" scoped>
.notification-dropdown {
  cursor: pointer;

  .notification-dropdown__icon {
    position: relative;
    display: flex;
    align-items: center;
  }

  .va-dropdown__anchor {
    display: inline-block;
  }
}
</style>
