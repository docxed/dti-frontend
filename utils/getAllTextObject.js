export function createSearchText(items) {
  const getObjectValues = (obj) =>
    obj && typeof obj === 'object' ? Object.values(obj).map(getObjectValues).flat() : [obj]

  items.map((i) => {
    i['searchKey'] = getObjectValues(i).join('||')
  })
  return items
}
