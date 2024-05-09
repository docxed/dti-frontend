<template>
  <v-form v-model="valid" ref="form" @submit.prevent="submit()" lazy-validation>
    <v-text-field
      v-model="$auth.user.email"
      prepend-icon="mdi-email"
      maxlength="100"
      label="อีเมล"
      disabled
    />
    <v-text-field
      v-model="form.dq_score"
      type="number"
      :rules="[$rules.required_zero_allow, $rules.number]"
      label="คะแนนระดับความฉลาดทางดิจิทัล DQ"
    />
    <v-text-field
      v-model="form.m2_score"
      type="number"
      :rules="[
        $rules.required_zero_allow,
        $rules.number,
        $rules.number_gte(0),
        $rules.number_lte(4),
      ]"
      label="เกรดเฉลี่ยรายวิชาวิทยาการคำนวณตอนม.2"
    />
    <v-row>
      <v-col cols="12" sm="2">
        <v-select
          v-model="form.prefix"
          :rules="[$rules.required]"
          :items="prefixItem"
          label="คำนำหน้า"
        />
      </v-col>
      <v-col cols="6" sm="5">
        <v-text-field
          v-model="form.firstname"
          :rules="[$rules.required, $rules.thai_only, $rules.maxlength(100)]"
          label="ชื่อ (ภาษาไทย)"
        />
      </v-col>
      <v-col cols="6" sm="5">
        <v-text-field
          v-model="form.lastname"
          :rules="[$rules.required, $rules.thai_only, $rules.maxlength(100)]"
          label="นามสกุล (ภาษาไทย)"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model="form.school"
      :rules="[$rules.required, $rules.maxlength(255)]"
      prepend-icon="mdi-school"
      label="โรงเรียน"
    />
    <v-row>
      <v-col cols="12" sm="2">
        <v-select
          v-model="form.gender"
          :rules="[$rules.required]"
          :items="genderItem"
          label="เพศ"
        />
      </v-col>
      <v-col cols="6" sm="5">
        <form-date-field
          :value.sync="form.birthday"
          @input="form.birthday = $event"
          :max="new Date().toISOString().substr(0, 10)"
          label="วันเกิด"
        />
      </v-col>
      <v-col cols="6" sm="5">
        <v-text-field
          v-model="form.phone"
          :rules="[$rules.maxlength(10), $rules.phone]"
          prepend-icon="mdi-phone"
          label="มือถือ"
        />
      </v-col>
    </v-row>
    <v-autocomplete
      v-model="form.province"
      :items="addressTHItem"
      label="จังหวัด"
      item-text="name_th"
      item-value="name_th"
      value="name_th"
      clearable
    />
    <v-row justify="center" class="mt-3">
      <v-col cols="12" sm="4">
        <v-btn block color="primary" type="submit" :disabled="valid === false" :loading="loading"
          >บันทึก</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import { PREFIX, GENDER } from '~/constants/user'
import AddressTH from '~/assets/data/api_province_with_amphure_tambon'
export default {
  mounted() {
    this.setItem()
  },
  data() {
    return {
      form: {
        dq_score: 0,
        m2_score: 0,
        prefix: 'นาย',
        firstname: '',
        lastname: '',
        school: '',
        gender: '',
        birthday: '',
        phone: '',
        province: '',
      },
      prefixItem: PREFIX,
      genderItem: GENDER,
      addressTHItem: AddressTH,
      loading: false,
      valid: null,
    }
  },
  methods: {
    setItem() {
      for (const key in this.form) {
        if (this.$auth.user[key]) {
          if (key === 'gender') {
            this.form[key] = this.genderItem.find(
              (item) => item.text === this.$auth.user[key],
            ).value
          } else {
            this.form[key] = this.$auth.user[key]
          }
        }
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.$put(`/user/${this.$auth.user.id}`, this.form)
          this.$toast.success('บันทึกข้อมูลสำเร็จ')
          await this.$auth.fetchUser()
          this.$emit('close')
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
  },
}
</script>
