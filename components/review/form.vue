<template>
  <v-form v-model="valid" ref="form" @submit.prevent="submit()" lazy-validation>
    <v-row>
      <v-col cols="6" sm="4">
        <v-select
          v-model="form.type"
          :rules="[$rules.required]"
          :items="['ก่อน', 'หลัง']"
          label="ประเภท"
          filled
        />
      </v-col>
    </v-row>
    <v-textarea
      v-model="form.question"
      :rules="[$rules.required, $rules.maxlength(500)]"
      label="รายการประเมิน"
      auto-grow
      rows="2"
      filled
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
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    isUpdate: {
      type: Boolean,
      default: false,
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
      form: {
        type: '',
        question: '',
      },
      loading: false,
    }
  },
  methods: {
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
        await this.$axios.put(`/review/${this.item._id}`, this.form)
        this.$emit('on-update')
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
        await this.$axios.post('/review', this.form)
        this.$emit('on-create')
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$emit('close')
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    setItem() {
      for (const key in this.form) {
        if (this.item[key]) {
          this.form[key] = this.item[key]
        }
      }
    },
  },
}
</script>
