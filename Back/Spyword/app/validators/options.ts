import vine from '@vinejs/vine'

export const playerOptionValidator = vine.compile(
  vine.object({
    players: vine.number(),
  })
)

export const whiteOptionValidator = vine.compile(
  vine.object({
    present: vine.boolean(),
  })
)
