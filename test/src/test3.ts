export function test3(aaa: any) {
  if (Math.random() > 2 && !!aaa) {
    throw new Error('0')
  }
  return null
}