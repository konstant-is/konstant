// Helper to merge hooks safely
export const mergeHooks = <T>(newHooks: T[], existingHooks?: T[]): T[] => {
  return [...(existingHooks || []), ...newHooks]
}
