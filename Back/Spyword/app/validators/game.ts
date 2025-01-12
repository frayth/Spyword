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
