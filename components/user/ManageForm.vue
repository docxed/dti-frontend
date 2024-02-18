<template>
  <v-form v-model="valid" ref="form" @submit.prevent="submit()" lazy-validation>
    <v-text-field
      v-model="form.email"
      :rules="[$rules.required, $rules.email, $rules.maxlength(100)]"
      prepend-icon="mdi-email"
      maxlength="100"
      label="อีเมล"
      :disabled="isUpdate"
    />
    <v-text-field
      v-model="form.dq_score"
      type="number"
      :rules="[$rules.required_zero_allow, $rules.number]"
      label="คะแนนระดับความฉลาดทางดิจิทัล DQ"
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
    <v-row>
      <v-col cols="4" sm="4">
        <v-select
          v-model="form.gender"
          :rules="[$rules.required]"
          :items="genderItem"
          label="เพศ"
        />
      </v-col>
      <v-col cols="8" sm="8">
        <v-text-field
          v-model="form.school"
          :rules="[$rules.required, $rules.maxlength(255)]"
          prepend-icon="mdi-school"
          label="โรงเรียน"
        />
      </v-col>
    </v-row>
    <v-autocomplete
      v-model="form.groups"
      :rules="[$rules.array_required]"
      :items="groupItem"
      multiple
      item-text="text"
      item-value="value"
      label="กลุ่มผู้ใช้"
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
      v-if="!isUpdate"
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
        <v-col cols="6" sm="6">
          <form-date-field
            :value.sync="form.birthday"
            @input="form.birthday = $event"
            :max="new Date().toISOString().substr(0, 10)"
            label="วันเกิด"
          />
        </v-col>
        <v-col cols="6" sm="6">
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
import { PREFIX, GENDER, GROUP } from '~/constants/user'
import AddressTH from '~/assets/data/api_province_with_amphure_tambon'
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    if (this.isUpdate) {
      this.setItem()
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
        gender: '',
        birthday: '',
        phone: '',
        province: '',
        groups: ['ครู'],
      },
      prefixItem: PREFIX,
      genderItem: GENDER,
      addressTHItem: AddressTH,
      groupItem: GROUP,
      loading: false,
      valid: null,
      show1: true,
      isMore: false,
    }
  },
  methods: {
    setItem() {
      for (const key in this.form) {
        if (this.item[key]) {
          if (key === 'gender') {
            this.form[key] = this.genderItem.find((item) => item.text === this.item[key]).value
          } else {
            this.form[key] = this.item[key]
          }
        }
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.isUpdate) {
          this.update()
        } else {
          this.create()
        }
      }
    },
    async update() {
      try {
        this.loading = true
        const { data } = await this.$axios.put(`/user/manage/${this.item.id}`, {
          dq_score: this.form.dq_score,
          prefix: this.form.prefix,
          firstname: this.form.firstname,
          lastname: this.form.lastname,
          school: this.form.school,
          gender: this.form.gender,
          birthday: this.form.birthday,
          phone: this.form.phone,
          province: this.form.province,
          groups: this.form.groups,
        })
        this.$emit('on-update', data)
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$emit('close')
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async create() {
      try {
        this.loading = true
        const { data } = await this.$axios.post(`/user/manage`, this.form)
        this.$emit('on-create', data)
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$emit('close')
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
