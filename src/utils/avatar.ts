// Total number of avatars available in public/avatars folder
export const TOTAL_AVATARS = 42

// Generate random avatar number (1-42)
export const getRandomAvatar = (): string => {
  const randomNum = Math.floor(Math.random() * TOTAL_AVATARS) + 1
  return `${randomNum}.png`
}

// Get avatar URL from avatar filename
export const getAvatarUrl = (avatar: string): string => {
  return `/avatars/${avatar}`
}

// Generate avatar for username (deterministic based on username)
// This ensures same username always gets same avatar
export const getAvatarForUsername = (username: string): string => {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  const avatarNum = (Math.abs(hash) % TOTAL_AVATARS) + 1
  return `${avatarNum}.png`
}
