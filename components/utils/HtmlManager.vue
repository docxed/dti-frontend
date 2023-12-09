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
      imageUploader: {},
    }
  },
}
</script>
