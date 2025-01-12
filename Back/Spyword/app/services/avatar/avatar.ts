const avatars = Array.from({ length: 22 }, (_, i) => `avatar${i + 1}.jpg`)

export function getRandomAvatar() {
  return avatars[Math.floor(Math.random() * avatars.length)]
}
