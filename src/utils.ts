export const storeToCookie = (key: string, value: string) => {
  document.cookie = `${key}=${value}; path=/; max-age=3600`
}

export const getFromCookie = (key: string) => {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [k, v] = cookie.trim().split("=")
    if (k === key) return v
  }
  return null
}

