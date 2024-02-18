<template>
  <div v-if="evaluateitemsGroupByUser.length > 0">
    <div v-for="(eva, index) in evaluateitemsGroupByUser" :key="`${index}`">
      <p>ผู้ประเมินคนที่ {{ index + 1 }} : {{ eva.total_score }} คะแนน</p>
    </div>
    <v-divider class="my-3" />
    <p>
      <strong>คะแนนรวมทั้งหมด</strong>
      {{ evaluateitems.reduce((acc, item) => acc + item.score, 0) }} คะแนน
    </p>
    <p>
      <strong>คะแนนเฉลี่ย</strong>
      {{
        (evaluateitems.reduce((acc, item) => acc + item.score, 0) / evaluateitems.length).toFixed(2)
      }}
      คะแนน
    </p>
  </div>
  <v-alert v-else>ไม่มีข้อมูล</v-alert>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.fetch()
  },
  data() {
    return {
      evaluateitems: [],
      loading: false,
    }
  },
  computed: {
    evaluateitemsGroupByUser() {
      return this.evaluateitems
        .reduce((acc, item) => {
          const user = item.user
          const found = acc.find((i) => i.user._id === user._id)
          if (found) {
            found.evaluate.push(item)
          } else {
            acc.push({
              user,
              evaluate: [item],
            })
          }
          return acc
        }, [])
        .map((e) => {
          e.total_score = e.evaluate.reduce((acc, item) => acc + item.score, 0)
          return e
        })
    },
  },
  methods: {
    async fetch() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get(`/evaluateitem`, {
          params: {
            enroll_id: this.item.id,
            del_flag: false,
          },
        })
        this.evaluateitems = data
      } catch (err) {
      } finally {
        this.$loader.hide()
      }
    },
  },
}
</script>
