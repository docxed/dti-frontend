<template>
  <div>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ item.title }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <p><strong>รายละเอียด</strong> <v-quill-viewer :data="item.description" /></p>
        <p><strong>เวลาทำ</strong> {{ item.time }} นาที</p>
        <p><strong>จำนวนครั้งที่สามารถทำได้</strong> {{ item.max_attempt }} ครั้ง</p>
        <p><strong>รหัสผ่าน</strong> {{ item.is_password ? item.password : '-' }}</p>
        <p>
          <strong>สถานะ</strong>
          <v-chip small label :color="item.is_published ? 'primary' : 'secondary'">
            {{ item.is_published ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
          </v-chip>
        </p>
        <p class="caption text-right">
          สร้างเมื่อ {{ item.create_date }} <br />
          แก้ไขเมื่อ {{ item.update_date }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn icon @click="dialogEdit = true"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteExamset()"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-tabs v-model="tab" grow class="mt-3">
        <v-tab key="question"> โจทย์ </v-tab>
        <v-tab key="student"> นักเรียน </v-tab>
        <v-tab key="teacher"> ผู้ประเมิน </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="question">
          <v-card flat>
            <v-card-text>
              <examsetitem-question :examsetId="this.$route.params.id" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item key="student">
          <examsetitem-student-list :examsetId="this.$route.params.id" hideAction />
        </v-tab-item>
        <v-tab-item key="teacher">
          <examsetitem-teacher-list :examsetId="this.$route.params.id" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <dialog-form :value.sync="dialogEdit" title="แก้ไขชุดแบบทดสอบ">
      <examset-form
        :updateItem="item"
        isUpdate
        @on-update="item = $event"
        @close="dialogEdit = false"
      />
    </dialog-form>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: this.item.title || this.title,
    }
  },
  mounted() {
    this.fetch()
  },
  data() {
    return {
      title: 'ข้อมูลชุดแบบทดสอบ',
      item: {},
      dialogEdit: false,
      tab: null,
    }
  },

  methods: {
    async deleteExamset() {
      if (await this.$store.dispatch('confirm/showConfirmDialog')) {
        try {
          this.$loader.show()
          await this.$axios.delete(`/examset/${this.item.id}`)
          this.$toast.success('ลบข้อมูลสำเร็จ')
          this.$router.push('/examset')
        } catch (err) {
        } finally {
          this.$loader.hide()
        }
      }
    },
    async fetch() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get(`/examset/${this.$route.params.id}`)
        this.item = data
      } catch (err) {
        this.$router.push('/examset')
      } finally {
        this.$loader.hide()
      }
    },
  },
}
</script>
