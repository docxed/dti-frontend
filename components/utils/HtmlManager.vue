<template>
  <div>
    <p class="title">{{ label }}</p>
    <v-quill-editor
      :isMobile="$vuetify.breakpoint.xsOnly"
      :value="text"
      @input="$emit('update:text', $event)"
      :blotFormatter="blotFormatter"
      :imageUploader="imageUploader"
    />
  </div>
</template>
<script>
import { DeleteAction, ResizeAction, ImageSpec } from 'quill-blot-formatter'
export class CustomImageSpec extends ImageSpec {
  getActions() {
    return [DeleteAction, ResizeAction]
  }
}
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'รายละเอียด',
    },
  },
  data() {
    return {
      blotFormatter: {
        specs: [CustomImageSpec],
      },
      imageUploader: {
        upload: (file) => {
          return new Promise(async (resolve, reject) => {
            try {
              const formData = new FormData()
              formData.append('file', file)
              const response = await this.$axios.post(`/file`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              const url = `${this.$config.prodURL}/file/media/${response.data.key}`
              resolve(url)
            } catch {
              reject(false)
            }
          })
        },
      },
    }
  },
}
</script>
