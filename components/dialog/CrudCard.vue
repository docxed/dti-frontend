<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ titlePage }}</v-toolbar-title>
      <v-spacer />
      <v-btn color="red" small fab @click="$emit('close')">
        <v-icon color="white">mdi-close-circle</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="mt-5">
      <v-form ref="form" v-model="valid" @submit.prevent="onCreate()" lazy-validation>
        <v-text-field
          v-model="text"
          :rules="[$rules.required, $rules.maxlength(255)]"
          counter="255"
          label="ชื่อ"
          filled
          dense
        >
          <template v-slot:append-outer>
            <v-btn block color="success" type="submit" :loading="loading"
              ><v-icon left>mdi-plus</v-icon>เพิ่ม</v-btn
            >
          </template>
        </v-text-field>
        <v-checkbox label="แสดงรายการที่ลบแล้ว" v-model="isShowDel" hide-details="auto" />
      </v-form>
      <v-list>
        <v-list-item v-for="(item, index) in itemsFiltered" :key="`item-${item.id}`">
          <v-list-item-content>
            <span v-if="editIndex === index">
              <v-form
                ref="formUpdate"
                v-model="validUpdate"
                @submit.prevent="onUpdate(item.id)"
                lazy-validation
              >
                <v-text-field
                  v-model="textEdit"
                  :rules="[$rules.required, $rules.maxlength(255)]"
                  counter="255"
                  label="ชื่อ"
                  filled
                  dense
                  hide-details="auto"
                >
                  <template v-slot:append-outer>
                    <v-btn icon color="success" type="submit" :loading="loading"
                      ><v-icon>mdi-checkbox-outline</v-icon></v-btn
                    >
                    <v-btn icon color="error" @click="editIndex = -1"
                      ><v-icon>mdi-close-box-outline</v-icon></v-btn
                    >
                  </template>
                </v-text-field>
              </v-form>
            </span>
            <span v-else>
              {{ item.name }}
            </span>
          </v-list-item-content>
          <v-list-item-action v-if="!(editIndex === index)">
            <v-row dense v-if="item.del_flag">
              <v-col>
                <v-btn small icon @click="$emit('on-restore', item.id)"
                  ><v-icon>mdi-restore</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-row dense v-else>
              <v-col>
                <v-btn
                  small
                  icon
                  @click="
                    editIndex = index
                    textEdit = item.name
                  "
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </v-col>
              <v-col>
                <v-btn small icon @click="$emit('on-delete', item.id)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    titlePage: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      text: '',
      valid: false,
      validUpdate: false,
      isShowDel: false,
      editIndex: -1,
      textEdit: '',
    }
  },
  computed: {
    itemsFiltered() {
      return this.items.filter((item) => {
        if (this.isShowDel) {
          return true
        } else {
          return !item.del_flag
        }
      })
    },
  },
  methods: {
    onUpdate(id) {
      if (this.validUpdate) {
        this.$emit('on-update', { id, name: this.textEdit })
      }
    },
    onCreate() {
      if (this.$refs.form.validate()) {
        this.$emit('on-create', this.text)
      }
    },
    reset() {
      this.text = ''
      this.editIndex = -1
      this.textEdit = ''
      this.$refs.form.reset()
      this.$refs.form.resetValidation()
    },
  },
}
</script>
