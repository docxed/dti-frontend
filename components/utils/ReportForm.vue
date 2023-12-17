<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit()" lazy-validation>
    <v-row>
      <v-col cols="12" sm="8">
        <v-container fluid>
          <v-row dense>
            <v-col v-if="isShow('start_date')">
              <slot name="start-date" :data="data" :update="update">
                <form-date-field
                  :value="data.start_date"
                  @input="update({ start_date: $event })"
                  :rules="[$rules.required]"
                  :min="startMinDate"
                  :max="data.end_date"
                  label="วันเริ่ม"
                  filled
                  clearable
                />
              </slot>
            </v-col>
            <v-col v-if="isShow('end_date')">
              <slot name="end-date" :data="data" :update="update">
                <form-date-field
                  :value="data.end_date"
                  @input="update({ end_date: $event })"
                  :min="data.start_date"
                  :max="endMaxDate"
                  :rules="[$rules.required]"
                  label="วันสิ้นสุด"
                  filled
                  clearable
                />
              </slot>
            </v-col>
          </v-row>
          <slot name="report-form"></slot>
        </v-container>
      </v-col>
      <v-col cols="12" sm="4">
        <v-container fill-height fluid>
          <v-row align="center" dense>
            <v-col cols="12" v-if="hasSearch">
              <v-btn block type="submit" color="primary" :loading="loading">
                <v-icon left>mdi-magnify</v-icon>ค้นหา</v-btn
              >
            </v-col>
            <v-col cols="12" v-if="hasReset">
              <v-btn block color="secondary" @click="refresh()">
                <v-icon left>mdi-refresh</v-icon>รีเซ็ต</v-btn
              >
            </v-col>
            <slot name="button"></slot>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    hasSearch: {
      type: Boolean,
      default: true,
    },
    hasReset: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    startMinDate: {
      type: String,
      default: null,
    },
    endMaxDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      valid: false,
    }
  },
  methods: {
    isShow(field) {
      return field in this.data
    },
    update(event) {
      this.$emit('update:data', { ...this.data, ...event })
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit('click-search')
      }
    },
    refresh() {
      this.$emit('click-reset')
    },
  },
}
</script>
