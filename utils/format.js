export function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}
export function getFileIcon(type) {
  if (type.split('/')[0] === 'image') {
    return 'mdi-file-image'
  } else if (type.split('/')[0] === 'video') {
    return 'mdi-file-video'
  } else if (type.split('/')[0] === 'audio') {
    return 'mdi-file-music'
  } else if (type === 'application/pdf') {
    return 'mdi-file-pdf-box'
  } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'mdi-file-word'
  } else if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return 'mdi-file-excel'
  } else if (type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    return 'mdi-file-powerpoint'
  } else {
    return 'mdi-file'
  }
}
export function convertFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(1)} ${units[index]}`
}
