<template>
  <v-row justify="center">
    <v-col cols="12" sm="8">
      <v-form ref="form" v-model="valid" @submit.prevent="submit()" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="[$rules.required, $rules.email, $rules.maxlength(100)]"
          prepend-icon="mdi-email"
          maxlength="100"
          counter="100"
          label="อีเมล"
        />
        <v-divider class="my-5" />
        <p>
          หลังจากกดยืนยันแล้ว ระบบจะทำการส่งรหัสผ่านชั่วคราวไปยังอีเมลของท่าน
          และให้ใช้รหัสผ่านที่ได้ในการเข้าสู่ระบบ
        </p>
        <v-row justify="center">
          <v-col cols="6" sm="4">
            <v-btn block color="error" @click="$emit('close')">ยกเลิก</v-btn>
          </v-col>
          <v-col cols="6" sm="4">
            <v-btn
              block
              color="success"
              type="submit"
              :loading="loading"
              :disabled="valid === false || delay > 0"
              >ยืนยัน {{ delay > 0 ? `(${delay})` : '' }}</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  mounted() {
    this.startCountdown()
  },
  data() {
    return {
      loading: false,
      email: '',
      valid: false,
      delay: 0,
      countdownInterval: null,
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.post('/auth/reset-password', {
            email: this.email,
          })
          this.$toast.success('ส่งรหัสผ่านชั่วคราวไปยังอีเมลของท่านแล้ว')
          // set time to done to localstorage
          const now = Date.now()
          const done = now + 1000 * 60 * 3
          localStorage.setItem('reset-password-done', done)
          this.startCountdown()
          this.$emit('close')
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
    startCountdown() {
      const done = localStorage.getItem('reset-password-done')
      if (done) {
        const now = Date.now()
        const diff = done - now
        if (diff > 0) {
          this.delay = Math.ceil(diff / 1000)
          this.countdownInterval = setInterval(() => {
            this.delay--
            if (this.delay <= 0) {
              clearInterval(this.countdownInterval)
              localStorage.removeItem('reset-password-done')
            }
          }, 1000)
        } else {
          localStorage.removeItem('reset-password-done')
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval)
  },
}
</script>
