import currencyjs from 'currency.js'

class Currency extends currencyjs {
  constructor(value, opt = { precision, display_precision, symbol }) {
    if (!opt.precision) opt.precision = 5
    if (!opt.display_precision) opt.display_precision = 2
    if (!opt.symbol) opt.symbol = ''

    super(value, { precision: opt.precision, symbol: '' })
    this.symbol = opt.symbol
    this.precision = opt.precision
    this.display_precision = opt.display_precision
  }

  val() {
    return currencyjs(this.value, { precision: 2 }).value
  }

  format() {
    return currencyjs(this.value, {
      precision: this.display_precision,
      symbol: this.symbol,
    }).format()
  }

  subtract(arg) {
    return new Currency(super.subtract(arg))
  }

  add(arg) {
    return new Currency(super.add(arg))
  }

  multiply(arg) {
    return new Currency(super.multiply(arg))
  }

  divide(arg) {
    return new Currency(super.divide(arg))
  }

  toString() {
    return this.format()
  }
}

function currency(val, opt = {}) {
  return new Currency(val, opt)
}

export default (context, inject) => {
  inject('currency', currency)
}
