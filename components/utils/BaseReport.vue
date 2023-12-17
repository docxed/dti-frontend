<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ reportTitle }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <utils-report-form
        :data="form"
        :has-search="hasSearch"
        :has-reset="hasReset"
        :loading="loading"
        :startMinDate="startMinDate"
        :endMaxDate="endMaxDate"
        @update:data="$emit('update:form', $event)"
        @click-search="$emit('click-search')"
        @click-reset="$emit('click-reset')"
      >
        <template v-slot:report-form>
          <slot name="report-form"></slot>
        </template>
        <template v-slot:button>
          <slot name="button"></slot>
        </template>
      </utils-report-form>
      <slot name="divider">
        <v-divider class="my-3"></v-divider>
      </slot>
      <utils-data-table
        :headers="headers"
        :items="items"
        :expand="expand"
        :search="search"
        :selection="selection"
        :selected="selected"
        @update:selected="$emit('update:selected', $event)"
        :pagination="pagination"
        :loading="loading"
        @update:pagination="$emit('update:pagination', $event)"
      >
        <template v-slot:items="{ props }">
          <slot name="items" :item="props.item"></slot>
        </template>
        <template v-for="item in headers" v-slot:[tdslot(item)]="slotProps">
          <slot :name="'td-' + item.value" :item="slotProps.item"></slot>
        </template>
        <template v-slot:expand-panel="slotProps">
          <slot name="table-expand-panel" :item="slotProps.item"></slot>
        </template>
        <template v-slot:footer>
          <slot name="table-footer"></slot>
        </template>
      </utils-data-table>
      <slot name="extension"></slot>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    reportTitle: {
      type: String,
      default: null,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    expand: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        descending: false,
      }),
    },
    search: {
      type: String,
      default: null,
    },
    hasSearch: {
      type: Boolean,
      default: true,
    },
    hasReset: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: () => [],
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
  methods: {
    tdslot(item) {
      return 'td-' + item.value
    },
  },
}
</script>
