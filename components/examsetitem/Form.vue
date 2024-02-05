<template>
  <v-form ref="form" v-model="valid" @submit.prevent="onSubmit()" lazy-validation>
    <v-row>
      <v-col>
        <utils-html-manager :text.sync="form.question" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <examsetitem-tag-field
          :data.sync="form.category_id"
          :rules="[$rules.required]"
          filled
          label="หมวดหมู่องค์ประกอบ"
        />
      </v-col>
    </v-row>
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
    examsetId: {
      type: String,
      required: true,
    },
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
        question: '',
        category_id: null,
      },
    }
  },
  methods: {
    setItem() {
      this.form.question = this.updateItem.question
      this.form.category_id = this.updateItem.category.id
    },
    onSubmit() {
      if (!this.form.question) {
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
        const { data } = await this.$axios.put(`/examsetitem/${this.updateItem.id}`, {
          ...this.form,
          examset_id: this.examsetId,
        })
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
        const { data } = await this.$axios.post(`/examsetitem`, {
          ...this.form,
          examset_id: this.examsetId,
        })
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
