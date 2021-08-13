export const removeDuplicates = (data, key) => {
  if (data) {
    return [...new Map(data.map(item => [key(item), item])).values()]
  } else {
    return []
  }
}
