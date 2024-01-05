export default (context, inject) => {
  const rules = {
    required: (v) => !!v || 'ต้องกรอก',
    email: (v) => /.+@.+\..+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง',
    // รหัสผ่านจะต้องมี 8 ตัวขึ้นไป เป็นตัวอักษรผสมตัวเลข
    password: (v) =>
      !v ||
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v) ||
      'รหัสผ่านจะต้องมี 8 ตัวขึ้นไป เป็นตัวอักษรผสมตัวเลข',
    phone: (v) => /^0[0-9]{9}$/.test(v) || 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
    array_required: (v) => v.length > 0 || 'ต้องกรอก',
    required_zero_allow: (v) => v === 0 || !!v || 'ต้องกรอก',
    numeric: (v) => !isNaN(v) || 'กรอกตัวเลข',
    positive: (v) => v >= 0 || 'กรอกค่ามากกว่า 0',
    more_than_zero: (v) => v > 0 || 'กรอกค่ามากกว่า 0',
    not_zero: (v) => v !== 0 || 'ห้ามกรอก 0',
    alphanumeric: (v) =>
      /^[a-zA-Z0-9]+$/.test(v) || 'กรอกเฉพาะตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น',
    upper_case_alphanumeric: (v) =>
      /^[A-Z0-9]+$/.test(v) || 'ต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์ใหญ่หรือตัวเลข',
    integer: (v) => Number.isInteger(Number(v)) || 'กรอกเลขจำนวนเต็ม',
    maxlength: (n) => (v) => !v || v.length <= n || `ต้องกรอกไม่เกิน ${n} ตัวอักษร`,
    minlength: (n) => (v) => !v || v.length >= n || `ต้องกรอกอย่างน้อย ${n} ตัวอักษร`,
    number_lte: (n) => (v) => !v || Number(v) <= n || `กรุณากรอกค่าน้อยกว่าหรือเท่ากับ ${n}`,
    number_gte: (n) => (v) => !v || Number(v) >= n || `กรุณากรอกค่ามากกว่าหรือเท่ากับ ${n}`,
    number_gt: (n) => (v) => !v || Number(v) > n || `กรุณากรอกค่ามากกว่า ${n}`,
    number_lt: (n) => (v) => !v || Number(v) < n || `กรุณากรอกค่าน้อยกว่า ${n}`,
    thai_only: (v) => /^[ก-๙]+$/.test(v) || 'กรอกภาษาไทยเท่านั้น',
    sameAs: (other) => (v) => v === other || 'กรอกไม่ตรงกัน',
  }
  inject('rules', rules)
}
