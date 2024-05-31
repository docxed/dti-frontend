import Vue from 'vue'
export default function ({ $axios, redirect }) {
  // $axios.onRequest(config => {
  //   console.log('Making request to ' + config.url)
  // })

  $axios.onError((error) => {
    const name = error.response.data.name
    const statusCode = error.response.data.statusCode
    if (name === 'ValidationError') {
      Vue.$toast.error(error.response.data.message)
    } else if (statusCode === 400) {
      Vue.$toast.error(error.response.data.message)
    } else if (statusCode === 401) {
      Vue.$toast.error('กรุณาเข้าสู่ระบบใหม่อีกครั้ง')
    } else if (statusCode === 500) {
      Vue.$toast.error('เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ')
    } else if (statusCode === 403) {
      Vue.$toast.error('คุณไม่มีสิทธิ์ใช้งานส่วนนี้')
    } else if (statusCode === 404) {
      Vue.$toast.error('ไม่พบข้อมูลที่คุณต้องการ')
    }
  })
}
