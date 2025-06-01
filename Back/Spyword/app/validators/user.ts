import vine from '@vinejs/vine'
export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).escape(),
    password: vine.string(),
  })
)

export const connectUserValidator = vine.compile(
  vine.object({
    name: vine.string().escape(),
  })
)

export const changeAvatarValidator = vine.compile(
  vine.object({
    mode: vine.enum(['increment', 'decrement', 'choose']),
    avatar: vine.number().optional().requiredWhen('mode', '=', 'choose'),
  })
)
