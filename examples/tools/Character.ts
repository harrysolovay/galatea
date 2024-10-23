import { T } from "galatea"

export const Sex = T.union({
  Male: T.none,
  Female: T.none,
})

export const Body = T.object({
  age: T.number,
  sex: Sex,
})

export const Gender = T.union({
  Male: T.none,
  Female: T.none,
  Other: T.string,
})

export const Main = T.object({
  name: T.string,
  background: T.string,
})

export const Anonymous = T.object({
  disposition: T.string,
  focusReason: T.string,
})

export const Details = T.union({
  Main,
  Anonymous,
})

export class Character extends T.object({
  body: Body,
  gender: Gender,
  details: Details,
}) {}
