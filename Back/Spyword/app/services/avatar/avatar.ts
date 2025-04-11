const avatars = Array.from({ length: 22 }, (_, i) => `avatar${i + 1}.jpg`)

export function getRandomAvatar(avatarAlreadyUsed: string[]): string {
  const filteredAvatars = avatars.filter((avatar) => !avatarAlreadyUsed.includes(avatar))
  return filteredAvatars[Math.floor(Math.random() * filteredAvatars.length)]
}
