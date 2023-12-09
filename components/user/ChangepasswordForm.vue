<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit()" lazy-validation>
    <v-text-field
      v-model="form.password"
      :rules="[$rules.required]"
      prepend-icon="mdi-lock"
      :type="show1 ? 'text' : 'password'"
      :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="show1 = !show1"
      label="รหัสผ่านเดิม"
      filled
    />
    <v-text-field
      v-model="form.new_password"
      :rules="[$rules.required, $rules.password, $rules.maxlength(20)]"
      prepend-icon="mdi-lock"
      :type="show2 ? 'text' : 'password'"
      :append-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="show2 = !show2"
      maxlength="20"
      counter="20"
      label="รหัสผ่านใหม่"
      filled
    />
    <v-text-field
      v-model="form.confirm_new_password"
      :rules="[
        $rules.required,
        $rules.password,
        $rules.maxlength(20),
        $rules.sameAs(form.new_password),
      ]"
      prepend-icon="mdi-lock"
      :type="show3 ? 'text' : 'password'"
      :append-icon="show3 ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="show3 = !show3"
      maxlength="20"
      counter="20"
      label="ยืนยันรหัสผ่านใหม่"
      filled
    />
    <v-row justify="center">
      <v-col cols="6" sm="4">
        <v-btn block color="error" @click="$emit('close')">ยกเลิก</v-btn>
      </v-col>
      <v-col cols="6" sm="4">
        <v-btn block color="success" type="submit" :loading="loading" :disabled="valid === false"
          >บันทึก</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
export default {
  mounted() {
    console.log('mou')
  },
  data() {
    return {
      valid: false,
      loading: false,
      form: {
        password: '',
        new_password: '',
        confirm_new_password: '',
      },
      show1: false,
      show2: false,
      show3: false,
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.post('/auth/change-password', this.form)
          this.$toast.success('เปลี่ยนรหัสผ่านสำเร็จ')
          this.$emit('close')
        } catch (error) {
        } finally {
          this.loading = false
        }
      }
    },
  },
}
</script>
