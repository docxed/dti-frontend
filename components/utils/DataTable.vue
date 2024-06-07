<template>
  <div>
    <v-toolbar color="primary" dark v-if="title">
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :footer-props="{
        'items-per-page-options': $attrs.hasOwnProperty('server-items-length')
          ? [50]
          : [10, 20, 50, 100],
      }"
      v-bind="$attrs"
      :headers="headers"
      :items="resultItems"
      :search="search"
      :loading="loading"
      item-key="data-table-id"
      :show-select="selection"
      :page.sync="pagination.page"
      :sort-by.sync="pagination.sortBy"
      :sort-desc.sync="pagination.descending"
      :itemsPerPage.sync="pagination.itemsPerPage"
      checkbox-color="primary"
      @input="$emit('update:selected', $event)"
    >
      <template v-slot:item="props">
        <slot name="items" :props="props">
          <tr :active="props.isSelected" @click="toggleExpand(props)">
            <td v-if="selection">
              <v-simple-checkbox
                :value="props.isSelected"
                color="primary"
                hide-details
                @click.stop="props.select(!props.isSelected)"
              />
            </td>
            <template v-for="field in headers">
              <slot :name="`td-${field.value}`" :item="props.item">
                <td :key="field.value" :class="field.class" :style="getStyle(field)">
                  <template v-if="field.type === 'datetime'">
                    {{
                      props.item[field.value]
                        ? $moment(props.item[field.value]).format('YYYY-MM-DD HH:mm')
                        : ''
                    }}
                  </template>
                  <template v-else-if="field.type === 'date'">
                    {{
                      props.item[field.value]
                        ? $moment(props.item[field.value]).format('YYYY-MM-DD')
                        : ''
                    }}
                  </template>
                  <template v-else-if="field.type === 'currency'">
                    {{
                      props.item[field.value] ? $currency(props.item[field.value]).format() : 0.0
                    }}
                  </template>
                  <template v-else-if="field.type === 'number'">
                    {{ props.item[field.value] ? Number(props.item[field.value]) : 0 }}
                  </template>
                  <template v-else-if="field.type === 'link'">
                    <router-link
                      v-if="props.item[field.value] !== '-'"
                      :to="getLink(field.pattern, props.item)"
                      target="_blank"
                    >
                      {{ props.item[field.value] }}
                    </router-link>
                    <p v-else>-</p>
                  </template>
                  <template v-else>
                    {{ props.item[field.value] }}
                  </template>
                </td>
              </slot>
            </template>
          </tr>
        </slot>
      </template>
      <template v-slot:expanded-item="props">
        <tr>
          <td colspan="100%" class="pa-0">
            <v-card flat>
              <v-card-text>
                <slot name="expand-panel" :item="props.item"> </slot>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
      <template v-slot:footer>
        <slot name="footer"></slot>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { createSearchText } from '~/utils/getAllTextObject'
export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
      default: null,
    },
    loading: {
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
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    resultItems() {
      let result = []
      if (this.search === null) {
        result = this.items
      } else {
        result = createSearchText(this.items)
      }
      for (const item of result) {
        item['data-table-id'] = uuidv4()
      }
      return result
    },
  },
  methods: {
    getStyle(field) {
      const style = {}
      if (field.align) {
        style['text-align'] = field.align
      }
      return style
    },
    getLink(pattern, item) {
      let url = pattern
      const match = pattern.matchAll(/:([A-Za-z0-9_]+)/g)
      for (const m of match) {
        url = url.replace(m[0], item[m[1]])
      }
      return url
    },
    toggleExpand(props) {
      if (this.expand) {
        props.expand(!props.isExpanded)
      }
    },
  },
}
</script>
