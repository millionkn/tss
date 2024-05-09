import { test3 } from "./test3"

export function test2(aaa: any) {
  if (Math.random() > 2 && !!aaa && !!test3) {
    throw new Error('0')
  }
  return null
}