export default function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0))

  for (let i = 0; i <= a.length; i++) {
    for (let j = 0; j <= b.length; j++) {
      if (i === 0) dp[i][j] = j
      else if (j === 0) dp[i][j] = i
      else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // Suppression
          dp[i][j - 1] + 1, // Insertion
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Substitution
        )
      }
    }
  }

  return dp[a.length][b.length]
}
