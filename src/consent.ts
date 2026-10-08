// Opens the Usercentrics settings. Resolves false when the CMP isn't usable: blocked by the browser (no __ucCmp),
// or loaded but failed to start (domain not allowed), where isInitialized() never resolves.
type Cmp = { isInitialized(): Promise<boolean>; showSecondLayer(): Promise<void> }

export const openPrivacySettings = async () => {
  const cmp = (window as { __ucCmp?: Cmp }).__ucCmp
  const ready = cmp && (await Promise.race([cmp.isInitialized().catch(() => false), new Promise<false>((r) => setTimeout(() => r(false), 1500))]))
  if (ready) cmp.showSecondLayer().catch(() => {})
  return !!ready
}
