<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex flex-wrap justify-center items-center">
      <!-- Cards -->
      <div class="flex flex-col items-center mb-4">
        <VaCard
          class="h-30 w-40 mb-4"
          :style="{
            '--va-card-outlined-border': '5px var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Companys</p>
              <p class="va-arrow-up">14</p>
            </div>
          </VaCardContent>
        </VaCard>

        <VaCard
          class="h-30 w-40 mb-4"
          :style="{
            '--va-card-outlined-border': '5px var(--va-background-element)',
            '--va-card-outlined-box-shadow': '0px 1px 2px ',
          }"
          outlined
        >
          <VaCardContent>
            <div>
              <p>Total Users</p>
              <p class="va-arrow-up">3,652</p>
            </div>
          </VaCardContent>
        </VaCard>

        <VaCard
          class="h-30 w-40 mb-4"
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
      </div>

      <!-- Image -->
      <img src="/public/human.png" alt="human" width="600" />

      <!-- Form -->
      <VaForm ref="form" class="flex flex-col justify-center items-center w-80" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">เข้าสู่ระบบ</h1>
        <VaInput
          v-model="formData.email"
          :rules="[validators.required, validators.email]"
          class="mb-4"
          label="อีเมล"
          type="email"
        />
        <VaValue v-slot="isPasswordVisible" :default-value="false">
          <VaInput
            v-model="formData.password"
            :rules="[validators.required]"
            :type="isPasswordVisible.value ? 'text' : 'password'"
            class="mb-4"
            label="รหัสผ่าน"
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
          <VaButton class="w-full" @click="submit"> เข้าสู่ระบบ</VaButton>
        </div>
      </VaForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
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
</script>
