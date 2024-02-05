<template>
  <v-form ref="form" v-model="valid" @submit.prevent="onSubmit()" lazy-validation>
    <v-text-field v-model="form.title" :rules="[$rules.required]" label="ชื่อแบบทดสอบ" filled />
    <v-row>
      <v-col>
        <utils-html-manager :text.sync="form.description" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="form.time"
          :rules="[$rules.required, $rules.numeric, $rules.integer, $rules.more_than_zero]"
          type="number"
          label="เวลาทำ"
          suffix="นาที"
          filled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="form.max_attempt"
          :rules="[$rules.required, $rules.numeric, $rules.integer, $rules.more_than_zero]"
          type="number"
          label="จำนวนครั้งที่สามารถทำได้"
          suffix="ครั้ง"
          filled
        />
      </v-col>
    </v-row>
    <v-checkbox v-model="form.is_password" color="primary" label="ตั้งรหัสผ่าน" />
    <v-row v-if="form.is_password">
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="form.password"
          :rules="[
            $rules.required,
            $rules.numeric,
            $rules.integer,
            $rules.minlength(4),
            $rules.maxlength(4),
          ]"
          maxlength="4"
          counter="4"
          label="รหัสผ่าน"
          filled
        />
      </v-col>
    </v-row>
    <v-switch :label="form.is_published ? 'เปิดใช้งาน' : 'ปิดใช้งาน'" v-model="form.is_published" />
    <v-row justify="center">
      <v-col cols="6" sm="4">
        <v-btn block @click="$emit('close')">ยกเลิก</v-btn>
      </v-col>
      <v-col cols="6" sm="4">
        <v-btn block color="success" type="submit" :loading="loading">บันทึก</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    updateItem: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    if (this.isUpdate) {
      this.setItem()
    }
  },
  data() {
    return {
      valid: false,
      loading: false,
      form: {
        title: '',
        description: '',
        time: 120,
        max_attempt: 3,
        is_password: false,
        password: '',
        is_published: false,
      },
    }
  },
  methods: {
    onSubmit() {
      if (!this.form.description) {
        return this.$toast.warning('กรุณากรอกข้อมูลให้ครบถ้วน')
      } else if (this.$refs.form.validate()) {
        if (this.isUpdate) {
          this.update()
        } else {
          this.submit()
        }
      }
    },
    async update() {
      try {
        this.loading = true
        const { data } = await this.$axios.put(`/examset/${this.updateItem.id}`, this.form)
        this.$emit('on-update', data)
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$emit('close')
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async submit() {
      try {
        this.loading = true
        const { data } = await this.$axios.post('/examset', this.form)
        this.$emit('on-create', data)
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$emit('close')
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    setItem() {
      this.form = {
        title: this.updateItem.title,
        description: this.updateItem.description,
        time: this.updateItem.time,
        max_attempt: this.updateItem.max_attempt,
        is_password: this.updateItem.is_password,
        password: this.updateItem.password,
        is_published: this.updateItem.is_published,
      }
    },
  },
}
</script>
