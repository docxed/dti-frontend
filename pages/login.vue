<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" lg="6">
      <v-row justify="center" class="mb-2">
        <v-col>
          <v-img src="/favicon.ico" class="mx-auto" width="30%" />
        </v-col>
      </v-row>
      <v-card>
        <v-card-title> เข้าสู่ระบบ </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form" @submit.prevent="submit()" lazy-validation>
            <v-text-field
              v-model="form.email"
              :rules="[$rules.required, $rules.email, $rules.maxlength(100)]"
              prepend-icon="mdi-email"
              maxlength="100"
              label="อีเมล"
            />
            <v-text-field
              v-model="form.password"
              :rules="[$rules.required, $rules.maxlength(20)]"
              prepend-icon="mdi-lock"
              :type="show1 ? 'text' : 'password'"
              :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show1 = !show1"
              maxlength="20"
              label="รหัสผ่าน"
            />
            <v-checkbox v-model="form.consent" :rules="[$rules.required]">
              <template v-slot:label>
                <div>
                  คุณได้อ่านและยอมรับ
                  <a href="/terms" target="_blank" @click.stop> ข้อตกลงและเงื่อนไข </a>
                  แล้ว
                </div>
              </template>
            </v-checkbox>
            <v-row justify="center" class="mt-3">
              <v-col cols="12" sm="4">
                <v-btn
                  block
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="valid === false"
                  >เข้าสู่ระบบ</v-btn
                >
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn block color="success" to="/register">ลงทะเบียน</v-btn>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col class="text-right">
                <v-btn text @click="dialogResetPassword = true">
                  <v-icon left> mdi-lock-question </v-icon>ลืมรหัสผ่าน</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
      <dialog-form :value.sync="dialogResetPassword" title="ลืมรหัสผ่าน">
        <user-resetpassword-form @close="dialogResetPassword = false" />
      </dialog-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  auth: 'guest',
  layout: 'full-screen',
  head() {
    return {
      title: 'เข้าสู่ระบบ',
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        consent: false,
      },
      loading: false,
      valid: null,
      show1: false,
      dialogResetPassword: false,
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$auth.loginWith('local', {
            data: {
              email: this.form.email,
              password: this.form.password,
            },
          })
          if (this.$auth.user.groups.some((group) => ['แอดมิน'].includes(group))) {
            this.$router.push('/examset')
          } else {
            this.$router.push('/home')
          }
        } catch (error) {
          console.log(error)
          this.form.password = ''
        } finally {
          this.loading = false
        }
      }
    },
  },
}
</script>
