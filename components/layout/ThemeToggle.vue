<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="info" small fab @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>
          mdi-{{ $vuetify.theme.dark ? 'white-balance-sunny' : 'moon-waxing-crescent' }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ $vuetify.theme.dark ? 'ปิด' : 'เปิด' }}โหมดมืด</span>
  </v-tooltip>
</template>
<script></script>
