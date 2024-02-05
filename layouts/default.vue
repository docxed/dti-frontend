<template>
  <v-app
    dark
    :style="{
      background: $vuetify.theme.themes[theme].background,
      color: $vuetify.theme.themes[theme].foreground,
      // text color
      fontColor: $vuetify.theme.themes[theme].fontColor,
    }"
  >
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          v-if="item.groups && $auth.user.groups.some((group) => item.groups.includes(group))"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title
        ><v-avatar color="primary" size="36" tile class="mb-1 mr-2">
          <v-img src="/favicon.ico" alt="Digital Intelligence Test Logo" /></v-avatar
        >{{ title }}</v-toolbar-title
      >
      <v-spacer />
      <!-- <layout-theme-toggle v-if="$config.node_env === 'development'" /> -->
      <layout-theme-selector />
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-chip v-bind="attrs" v-on="on" class="ml-2" light v-if="$vuetify.breakpoint.xsOnly">
            <v-icon left>mdi-account-details</v-icon>
          </v-chip>
          <v-chip v-bind="attrs" v-on="on" class="ml-2" light v-else>
            <v-icon left>mdi-account-circle</v-icon> <strong>{{ $auth.user.fullname }}</strong>
            <v-icon right>mdi-menu-down</v-icon>
          </v-chip>
        </template>
        <v-list>
          <template v-if="$vuetify.breakpoint.xsOnly">
            <v-list-item readonly>
              <v-list-item-content>
                <v-list-item-title>{{ $auth.user.fullname }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </template>
          <v-list-item @click="dialogEditUser = true">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="dialogChangePassword = true">
            <v-list-item-icon>
              <v-icon>mdi-lock-reset</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>เปลี่ยนรหัสผ่าน</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ออกจากระบบ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <dialog-form :value.sync="dialogEditUser" title="ข้อมูลส่วนตัว">
          <user-form @close="dialogEditUser = false" />
        </dialog-form>
        <dialog-form :value.sync="dialogChangePassword" title="เปลี่ยนรหัสผ่าน">
          <user-changepassword-form @close="dialogChangePassword = false" />
        </dialog-form>
        <dialog-confirm />
        <utils-loader />
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'หน้าหลัก',
          to: '/home',
          groups: ['แอดมิน', 'ครู', 'นักเรียน'],
        },
        {
          icon: 'mdi-format-list-checkbox',
          title: 'แบบทดสอบ',
          to: '/exam',
          groups: ['นักเรียน'],
        },
        {
          icon: 'mdi-format-list-checks',
          title: 'แบบทดสอบของฉัน',
          to: '/exam/my',
          groups: ['นักเรียน'],
        },
        {
          icon: 'mdi-file-document-multiple',
          title: 'จัดการชุดแบบทดสอบ',
          to: '/examset',
          groups: ['แอดมิน'],
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Digital Intelligence Test',
      dialogEditUser: false,
      dialogChangePassword: false,
    }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    },
  },
}
</script>
<style scoped>
#app {
  font-family: 'Noto Sans Thai', sans-serif;
}
</style>
