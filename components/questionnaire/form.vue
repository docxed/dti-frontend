<template>
  <div>
    <v-form v-model="valid" ref="form" @submit.prevent="submit()" lazy-validation>
      <div v-for="(review, index) in reviews" :key="review._id">
        <p>{{ index + 1 }}. {{ review.question }}</p>
        <v-radio-group v-model="review.answer" :rules="[$rules.required]" row>
          <v-radio
            v-for="item in answetItem"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </v-radio-group>
      </div>
      <v-row justify="center">
        <v-col cols="12" sm="4">
          <v-btn block color="primary" type="submit" :disabled="valid === false">บันทึก</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.fetchReview()
  },
  data() {
    return {
      reviews: [],
      valid: false,
      answetItem: [
        {
          text: 'มากที่สุด',
          value: 5,
        },
        {
          text: 'มาก',
          value: 4,
        },
        {
          text: 'ปานกลาง',
          value: 3,
        },
        {
          text: 'น้อย',
          value: 2,
        },
        {
          text: 'น้อยที่สุด',
          value: 1,
        },
      ],
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.create()
      }
    },
    async create() {
      try {
        this.$loader.show()
        await this.$axios.post('/reviewset', this.reviews)
        this.$toast.success('บันทึกข้อมูลสำเร็จ')
        this.$emit('on-create')
        this.$emit('close')
      } catch (err) {
      } finally {
        this.$loader.hide()
      }
    },
    async fetchReview() {
      try {
        this.$loader.show()
        const { data } = await this.$axios.get('/review', {
          params: {
            type: this.type,
          },
        })
        this.reviews = data.map((r) => {
          return {
            type: r.type,
            question: r.question,
            answer: null,
            user_id: this.$auth.user.id,
          }
        })
      } catch (err) {
      } finally {
        this.$loader.hide()
      }
    },
  },
}
</script>
