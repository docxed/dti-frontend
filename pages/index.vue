<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" lg="6">
      <v-row justify="center">
        <v-col>
          <v-img src="/favicon.ico" class="mx-auto" width="30%" />
        </v-col>
      </v-row>
      <v-card>
        <v-card-title> Digital Intelligence Test </v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum tempore error sit quae
          suscipit aperiam eius quam. Atque molestias debitis veniam voluptas. Ratione in, velit,
          eligendi nisi sint provident sunt illo rerum atque minus ipsum nihil quos dolores pariatur
          repellat natus voluptas delectus quasi? Eaque commodi praesentium veritatis quasi neque
          soluta cumque ipsa quia voluptatibus. Facilis explicabo recusandae quibusdam, doloribus
          molestiae iusto magnam accusantium iure nobis et suscipit, repudiandae culpa nostrum vitae
          velit voluptatum labore dolores sequi magni cum! Unde laborum at sapiente voluptas hic
          nulla dolorum nisi voluptatibus autem voluptatem. Laborum necessitatibus quas cupiditate
          ea consequuntur laboriosam odit recusandae dolores sed sunt debitis ex, dolore quaerat
          placeat est pariatur fugiat quibusdam culpa, vitae dicta iste repudiandae, nobis modi?
          Iure maiores iusto nobis, dolor aspernatur commodi, maxime eaque, deleniti dicta ratione
          voluptate! Laboriosam maxime dolores debitis pariatur est, dolor, deserunt voluptates,
          autem numquam amet iure magni laudantium. Dicta minima excepturi velit nesciunt impedit
          recusandae ipsam rem quasi. Commodi, possimus dolor quasi nobis rem enim doloremque
          molestias, ab dolore ut atque error rerum, culpa beatae quae? Non autem officiis doloribus
          itaque! Et sit aliquid accusamus tenetur iusto! Natus iure molestias ullam tenetur
          explicabo assumenda omnis inventore a et cupiditate officiis voluptates impedit, pariatur
          vero molestiae recusandae. Maiores cupiditate tempore molestias, et distinctio excepturi
          ad voluptate ea, ratione impedit consequuntur libero dolorem expedita? Sunt atque
          reiciendis eum dignissimos, iusto, ad aliquid veritatis esse doloremque quae soluta
          voluptatum quia molestiae, modi unde? Suscipit error perferendis quaerat natus
          praesentium, exercitationem delectus porro, laboriosam accusamus incidunt quam, ratione
          maiores doloribus.
          <v-row justify="center" class="mt-5">
            <v-col cols="12" sm="4">
              <v-btn block color="primary" @click="go()">เริ่มต้นใช้งาน</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  auth: false,
  layout: 'full-screen',
  head() {
    return {
      title: 'หน้าแรก',
    }
  },
  data() {
    return {}
  },
  methods: {
    go() {
      if (this.$auth.user?.id) {
        this.$router.push('/home')
      } else {
        this.$router.push('/login')
      }
    },
  },
}
</script>
