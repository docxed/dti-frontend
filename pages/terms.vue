<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" lg="8" xl="6">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title> ข้อตกลงในการให้ข้อมูลส่วนตัว </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="mt-5">
          <p class="text-h5"><strong>Digital Intelligence Test</strong></p>
          <p>
            ด้วยความยินยอมของท่านในการให้ข้อมูลส่วนตัวที่กล่าวถึงด้านล่างนี้
            ทางเราขอยืนยันว่าท่านยินยอมให้นำข้อมูลส่วนตัวต่อไปนี้ไปใช้ในการวิจัย:
          </p>
          <ol>
            <li>คำนำหน้านาม</li>
            <li>ชื่อ</li>
            <li>นามสกุล</li>
            <li>เพศ</li>
            <li>จังหวัด</li>
            <li>โรงเรียน</li>
          </ol>
          <br />
          <p>
            ข้อมูลที่ได้รับจะถูกนำไปใช้ในเชิงวิจัยเท่านั้น
            และจะถูกเก็บรักษาอย่างปลอดภัยตามนโยบายความเป็นส่วนตัวของทางเรา
            ทางเรายืนยันว่าข้อมูลนี้จะไม่ถูกเปิดเผยแก่บุคคลที่สามที่ไม่ได้รับอนุญาต
            หากท่านมีคำถามหรือข้อสงสัยเพิ่มเติมเกี่ยวกับการใช้ข้อมูลส่วนตัว กรุณาติดต่อเราที่
            <a :href="`mailto:${$config.contact_email}?subject=ข้อสงสัยเกี่ยวกับข้อมูลส่วนตัว`">
              {{ $config.contact_email }}
            </a>
          </p>
          <p>ขอบคุณที่ให้ความร่วมมือและความเข้าใจของท่านในการทำข้อตกลงนี้.</p>
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
      title: 'Terms',
    }
  },
  data() {
    return {}
  },
}
</script>
