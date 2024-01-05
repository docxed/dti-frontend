<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" lg="8" xl="6">
      <v-card>
        <v-card-title> ลงทะเบียน </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form" @submit.prevent="submit()" lazy-validation>
            <v-text-field
              v-model="form.email"
              :rules="[$rules.required, $rules.email, $rules.maxlength(100)]"
              prepend-icon="mdi-email"
              maxlength="100"
              counter="100"
              label="อีเมล"
            />
            <v-text-field
              v-model="form.dq_score"
              type="number"
              :rules="[$rules.required_zero_allow, $rules.number]"
              label="คะแนนระดับความฉลาดทางดิจิทัล DQ"
            />
            <p class="text-caption">
              คะแนนระดับความฉลาดทางดิจิทัล <b>DQ</b> สามารถตรวจสอบได้ที่
              <a href="https://dqassessment.com/th/home" target="_blank">คลิก</a>
            </p>
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
            <v-text-field
              v-model="form.password"
              :rules="[$rules.required, $rules.password, $rules.maxlength(20)]"
              prepend-icon="mdi-lock"
              :type="show1 ? 'text' : 'password'"
              :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show1 = !show1"
              maxlength="20"
              counter="20"
              label="รหัสผ่าน"
            />
            <v-text-field
              v-model="form.confirm_password"
              :rules="[
                $rules.required,
                $rules.password,
                $rules.maxlength(20),
                $rules.sameAs(form.password),
              ]"
              prepend-icon="mdi-lock"
              :type="show2 ? 'text' : 'password'"
              :append-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="show2 = !show2"
              maxlength="20"
              counter="20"
              label="ยืนยันรหัสผ่าน"
            />
            <v-row>
              <v-col>
                <v-btn text @click="isMore = !isMore"
                  >ข้อมูลเพิ่มเติม (ถ้ามี)
                  <v-icon right>{{ isMore ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <div v-if="isMore">
              <v-row>
                <v-col cols="12" sm="2">
                  <v-select v-model="form.gender" :items="genderItem" label="เพศ" />
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
            </div>
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
                  color="success"
                  type="submit"
                  :disabled="valid === false"
                  :loading="loading"
                  >ลงทะเบียน</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col class="text-right">
                <v-btn text to="/login">เข้าสู่ระบบ</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { PREFIX, GENDER } from '~/constants/user'
import AddressTH from '~/assets/data/api_province_with_amphure_tambon'
export default {
  auth: 'guest',
  layout: 'full-screen',
  head() {
    return {
      title: 'ลงทะเบียน',
    }
  },
  data() {
    return {
      form: {
        email: '',
        dq_score: 0,
        prefix: 'นาย',
        firstname: '',
        lastname: '',
        school: '',
        password: '',
        confirm_password: '',
        gender: '',
        birthday: '',
        phone: '',
        province: '',
        consent: false,
      },
      loading: false,
      valid: null,
      show1: false,
      show2: false,
      prefixItem: PREFIX.filter((item) => item !== 'นาง'),
      genderItem: GENDER,
      addressTHItem: AddressTH,
      isMore: false,
      showTerms: false,
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.post('/auth/register', this.form)
          this.$toast.success('ลงทะเบียนสำเร็จ')
          this.$router.push('/login')
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
  },
}
</script>
