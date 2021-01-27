export type Items = { [k: string]: string }
export type Profile = { name: string; items: Items; notes: string }
export type Parameter = { value: number; tmp: number; other: number }
export type Parameters = { [k: string]: Parameter }
export type Variables = { [k: string]: number }
export type Skill = {
  job: number
  hobby: number
  growth: number
  other: number
  fixed: boolean
  detail: string
}
export type Category = { [k: string]: Skill }
export type Skillset = { [k: string]: Category }

export type Character = {
  profile: Profile
  parameters: Parameters
  variables: Variables
  skillset: Skillset
}
