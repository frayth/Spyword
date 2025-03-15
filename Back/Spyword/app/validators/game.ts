import vine from '@vinejs/vine'

export const joinGameValidator = vine.compile(
  vine.object({
    game_id: vine.string(),
  })
)

export const kickGameValidator = vine.compile(
  vine.object({
    user_id: vine.string(),
  })
)

export const propositionValidator = vine.compile(
  vine.object({
    word: vine.string(),
  })
)

export const validateWordValidator = vine.compile(
  vine.object({
    value: vine.boolean(),
  })
)

export const voteValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
  })
)
