import vine from '@vinejs/vine'

export const joinGameValidator = vine.compile(
  vine.object({
    game_id: vine.string(),
  })
)
