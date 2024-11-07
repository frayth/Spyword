import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).escape(),
    password: vine.string(),
  })
)
