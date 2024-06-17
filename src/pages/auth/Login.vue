<template>
  <div :class="['flex-center', selectedBackground]">
    <!-- แถบซ้าย -->
    <div class="side-bar left-bar" @click="changeBackground('left')"></div>
    <!-- แถบขวา -->
    <div class="side-bar right-bar" @click="changeBackground('right')"></div>

    <div class="flex flex-wrap justify-center items-center content-container">
      <!-- Cards -->
      <div class="flex flex-col items-center mb-4">
        <VaCard
          class="h-30 w-40 ml-5 mb-40"
          :style="{
            '--va-card-outlined-border': '5px var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Companies</p>
              <p class="va-arrow-up">14</p>
            </div>
          </VaCardContent>
        </VaCard>

        <VaCard
          class="h-30 w-40 ml-5"
          :style="{
            '--va-card-outlined-border': '5px var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Users</p>
              <p class="va-arrow-up">{{ allUsers !== null ? allUsers : 'Loading...' }}</p>
            </div>
          </VaCardContent>
        </VaCard>
      </div>

      <!-- รูปภาพ -->
      <img src="/cute-girl-working-with-laptop-logo-banner-hand-drawn-cartoon-art-illustration.png" alt="human" width="600" />

      <VaCard
        class="h-30 w-40 mr-10"
        :style="{
          '--va-card-outlined-border': '5px var(--va-background-element)',
          '--va-card-outlined-box-shadow': '0px 1px 2px ',
        }"
        outlined
      >
        <VaCardContent>
          <div>
            <p>Total Tokens</p>
            <p class="va-arrow-up">100,000</p>
          </div>
        </VaCardContent>
      </VaCard>

      <!-- ฟอร์ม -->
      <VaForm ref="form" class="form-container flex flex-col justify-center items-center w-80" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">Login</h1>
        <VaInput
          v-model="formData.email"
          :rules="[validators.required, validators.email]"
          class="mb-4"
          label="Email"
          type="email"
        />
        <VaValue v-slot="isPasswordVisible" :default-value="false">
          <VaInput
            v-model="formData.password"
            :rules="[validators.required]"
            :type="isPasswordVisible.value ? 'text' : 'password'"
            class="mb-4"
            label="Password"
            @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
          >
            <template #appendInner>
              <VaIcon
                :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
                class="cursor-pointer"
                color="secondary"
              />
            </template>
          </VaInput>
        </VaValue>
        <div class="flex justify-center mt-4">
          <VaButton class="w-full" @click="submit">Login</VaButton>
        </div>
      </VaForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import axios from 'axios'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})

const allUsers = ref(null)
const apiUrl = 'http://89.213.177.27:8001/v1/owner/system_management/count_user_all_instance/'

onMounted(() => {
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      allUsers.value = data.All_USER;
    })
    .catch(error => {
      console.error('Error fetching all users:', error);
    });
});

const submit = async () => {
  if (validate()) {
    try {
      const response = await axios.post(
        'http://89.213.177.27:8001/v1/owner/login/token',
        new URLSearchParams({
          grant_type: '',
          email: formData.email,
          password: formData.password,
          scope: '',
          client_id: '',
          client_secret: '',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      )

      if (response.status === 200 && response.data.access_token) {
        console.log('access Token:', response.data.access_token)
        localStorage.setItem('access_token', response.data.access_token)
        init({ message: 'คุณเข้าสู่ระบบสำเร็จแล้ว', color: 'success' })
        push({ name: 'dashboard' })
      } else {
        init({ message: 'เข้าสู่ระบบไม่สำเร็จ', color: 'danger' })
      }
    } catch (error) {
      init({ message: 'เข้าสู่ระบบไม่สำเร็จ', color: 'danger' })
    }
  }
}

// Background selection logic
const backgrounds = [
  'background-1',
  'background-2',
  'background-3'
]
const selectedBackground = ref(backgrounds[Math.floor(Math.random() * backgrounds.length)])

// Function to change background
const changeBackground = (direction: string) => {
  const currentIndex = backgrounds.indexOf(selectedBackground.value)
  let newIndex

  if (direction === 'left') {
    newIndex = (currentIndex + 1) % backgrounds.length
  } else {
    newIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length
  }

  selectedBackground.value = backgrounds[newIndex]
}
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover; /* ทำให้รูปภาพครอบคลุมทั้งหน้าจอ */
  background-position: center; /* จัดตำแหน่งรูปภาพให้อยู่กึ่งกลาง */
  background-repeat: no-repeat; /* ไม่ให้รูปภาพซ้ำ */
  position: relative;
}

.background-1 {
  background-image: url('/dawn-sun-illuminates-fantastical-valley-with-mist-rugged-terrain-hint-celestial.jpg');
}

.background-2 {
  background-image: url('/dynamic-dreams-flyer-design-background.jpg');
}

.background-3 {
  background-image: url('/glowing-flowers-butterflies-dark-forest-night-flowers-butterflies-are-lit-by-magical-light.jpg');
}

.form-container {
  background-color: white; /* พื้นหลังสีขาว */
  border: 1px solid #ccc; /* กรอบขาว */
  padding: 20px; /* เพิ่มระยะห่างภายใน */
  border-radius: 8px; /* ขอบมุมโค้งมน */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เงา */
}

.side-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px; /* กำหนดความกว้างของแถบคลิก */
  cursor: pointer;
  z-index: 1; /* ทำให้แถบอยู่ด้านบนสุด */
}

.left-bar {
  left: 0;
}

.right-bar {
  right: 0;
}

.content-container {
  z-index: 2; /* ทำให้เนื้อหาอยู่ด้านบนแถบคลิก */
}

/******************** 980px ********************/
@media only screen and (max-width: 980px) {
  .va-card {
    display: none;
  }
  img {
    display: none;
  }
  .va-form {
    justify-content: center;
  }
}
</style>
