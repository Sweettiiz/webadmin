<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">เข้าสู่ระบบ</h1>
    <!-- <p class="text-base mb-4 leading-5">
      เพิ่งเคยใช้ Vuestic?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">สมัครสมาชิก</RouterLink>
    </p> -->
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

    <!-- <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="ให้ฉันลงชื่อเข้าใช้งานบนอุปกรณ์นี้" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        ลืมรหัสผ่าน?
      </RouterLink>
    </div> -->

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> เข้าสู่ระบบ</VaButton>
    </div>
  </VaForm>
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
