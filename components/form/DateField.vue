<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-text-field
        v-bind="attrs"
        v-model="value"
        :rules="rules"
        v-on="on"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        :filled="filled"
        clearable
        @click:clear="$emit('input', null)"
      />
    </template>
    <v-date-picker
      :value="value"
      :min="min"
      :max="max"
      scrollable
      locale="th"
      @input="$emit('input', $event) && (menu = false)"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'วันที่',
    },
    min: {
      type: String,
    },
    max: {
      type: String,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    filled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      menu: false,
    }
  },
}
</script>
