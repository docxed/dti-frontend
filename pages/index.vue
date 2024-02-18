<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" lg="6">
      <v-row justify="center" class="mb-2">
        <v-col>
          <v-img src="/favicon.ico" class="mx-auto" width="30%" />
        </v-col>
      </v-row>
      <v-card>
        <v-card-title> Digital Intelligence Test </v-card-title>
        <v-card-text>
          แบบวัดความฉลาดทางดิจิทัลตามแนวทางการประเมินการปฏิบัติเป็นแบบวัดความฉลาดทางดิจิทัล
          ที่ผู้วิจัยสร้างขึ้นใช้แนวทางการประเมินการปฏิบัติ (Performance assessment)
          โดยแบบวัดความฉลาดทาง ดิจิทัลใช้วัดในระดับการเป็นพลเมืองดิจิทัล ประกอบด้วย 8
          องค์ประกอบของการเป็นพลเมืองดิจิทัล ได้แก่ 1) อัตลักษณ์พลเมืองดิจิทัล (Digital Citizen
          Identity) 2) การใช้เทคโนโลยีอย่างสมดุล (Balanced Use of Technology) 3)
          การจัดการความเสี่ยงทางพฤติกรรมไซเบอร์ (Behavioral Cyber-Risk Management) 4)
          การจัดการความปลอดภัยทางไซเบอร์ส่วนบุคคล (Personal Cyber Security Management) 5) การเอา
          ใจใส่แบบดิจิทัล (Digital Empathy) 6) การจัดการร่องรอยดิจิทัล (Digital Footprint
          Management) 7) การรู้เท่าทันสื่อและข้อมูล (Media and Information Literacy) และ 8)
          การจัดการความเป็นส่วนตัว (Privacy Management) โดยใช้งานในรูปแบบของเว็บแอปพลิเคชัน
          ผู้เรียนต้องทําการสมัครสมาชิกเพื่อเข้า ใช้งานบนเว็บแอปพลิเคชันจากนั้นปฏิบัติตามภาระงาน
          (Task) ที่กําหนดเมื่อผู้เรียนปฏิบัติตามภาระงาน
          เสร็จสิ้นจึงนําภาระงานเข้าสู่ระบบเพื่อตรวจสอบให้คะแนนผ่านเกณฑ์ที่กําหนดในลักษณะรูบริก
          (Rubric score) และรายงานผลคะแนนให้ผู้เรียนรับทราบผลของการวัดนั้น
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
