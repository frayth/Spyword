const avatars = Array.from({ length: 26 }, (_, i) => `avatar${i}.jpg`)

export function getRandomAvatar(avatarAlreadyUsed: string[]): string {
  const filteredAvatars = avatars.filter((avatar) => !avatarAlreadyUsed.includes(avatar))
  return filteredAvatars[Math.floor(Math.random() * filteredAvatars.length)]
}

export function getAvatarUrl(
  id: number,
  option?: { mode: 'increment' | 'decrement' | 'choose' }
): string {
  console.log(id)
  if (option) {
    if (option.mode === 'increment') {
      id + 1 >= avatars.length ? (id = 0) : (id += 1)
    } else if (option.mode === 'decrement') {
      id - 1 < 0 ? (id = avatars.length - 1) : (id -= 1)
    }
  }
  if (id < 0 || id > avatars.length - 1) {
    id = 1
  }

  console.log(id, avatars[id])
  return `${avatars[id]}`
}

export function getNumberOfAvatars(): number {
  return avatars.length
}
