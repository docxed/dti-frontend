<template>
  <span>
    <v-file-input
      ref="uploader"
      :accept="accept"
      :label="label"
      :filled="filled"
      :show-size="showSize"
      :hint="hint"
      :persistent-hint="persistentHint"
      :loading="loading"
      clearable
      @change="onFileChanged($event)"
      v-if="value.length === 0"
    ></v-file-input>
    <v-chip
      label
      large
      class="mr-2 mb-2"
      color="primary"
      close
      v-for="(file, index) in value"
      :key="`file-${index}`"
      @click:close="$emit('remove', index)"
      @click="openFile(file)"
    >
      <v-icon left>mdi-paperclip</v-icon> {{ truncateString(file, 30) }}
    </v-chip>
  </span>
</template>
<script>
import { getFileIcon, truncateString } from '~/utils/format'
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: 'อัปโหลดไฟล์',
    },
    filled: {
      type: Boolean,
      default: false,
    },
    showSize: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: Array,
      default: () => [],
    },
    autoUpload: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
    persistentHint: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    validate(file) {
      let valid = true
      if (!file) {
        valid = false
      } else if (file.size > 5 * 1024 * 1024) {
        this.$toast.error('ไฟล์ใหญ่เกิน 5 MB')
        valid = false
      } else if (file.name.length > 100) {
        this.$toast.error('ชื่อไฟล์ยาวเกิน 100 ตัวอักษร')
        valid = false
      }
      return valid
    },
    async onFileChanged(event) {
      const file = event
      if (!this.validate(file)) {
        return
      }
      if (this.autoUpload) {
        this.upload(file)
      }
    },
    async upload(file) {
      try {
        this.loading = true
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await this.$axios.post('/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        this.$emit('input', data.key)
        this.$toast.success('อัปโหลดไฟล์สำเร็จ')
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    openFile(file) {
      return window.open(`${this.$config.prodURL}/file/media/${file}`, '_blank')
    },
    getFileIcon,
    truncateString,
  },
}
</script>
