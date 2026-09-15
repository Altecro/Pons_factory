# $TIKITAKI — Launch Plan (Pons V2)

**Target:** 15:00 user-local today  
**Do NOT broadcast until T-0 checklist is green.**  
**X/Twitter:** Aurel handles — twitter: https://x.com/tikitaki_rh

## Token

| Field | Value |
|-------|-------|
| Name | Tiki Taki |
| Symbol | TIKITAKI |
| creatorTaxBps | 300 |
| fee recipient (treasury) | `0x04ac415251c7BB02358177f729490fC94B12E4b8` |
| Atomic first buy | `--buy-eth 0.01` |
| Deployer wallet | `0xbBDE58C5878Df52DDbE08f4C9F18274431546466` (unfunded until ~15h) |
| Logo (local) | `docs/tikitaki-logo.png` (1024×1024) |
| Logo (intended raw) | `https://tikitaki.fun/tikitaki-logo.png` |
| Site | `launches/tikitaki/site/` (mirror: `sites/tikitaki/`) |

## Description (EN)

Short spicy snack energy — Watching Netflix and Tiki Takis lyric meme. Crunch loud. Heat high. Pure entertainment. DYOR.

## Dry-run (already run once; re-run OK)

```bash
cd /workspace/pons-factory-starter
npm run factory -- launch \
  --name "Tiki Taki" \
  --symbol TIKITAKI \
  --description "Short spicy snack energy — Watching Netflix and Tiki Takis lyric meme. Crunch loud. Heat high. Pure entertainment. DYOR." \
  --logo "https://tikitaki.fun/tikitaki-logo.png" \
  --creator-tax-bps 300 \
  --fee-recipient 0x04ac415251c7BB02358177f729490fC94B12E4b8 \
  --buy-eth 0.01 \
  --from 0xbBDE58C5878Df52DDbE08f4C9F18274431546466 \
  --dry-run
# Optional once Aurel sends X URL:
#   --twitter https://x.com/tikitaki_rh
```

Result saved: `launches/tikitaki/launch-result.json` (dry-run, no `--broadcast`).

## Ready-for-15h checklist

- [ ] **OG recheck at T-0** — `npm run factory -- check --symbol TIKITAKI --name "Tiki Taki"` (must be free)
- [x] **X URL** — https://x.com/tikitaki_rh
- [x] **Domain + logo** — https://tikitaki.fun (+ logo path) — `docs/tikitaki-logo.png` → Altecro/Pons_factory raw URL (gh auth was missing at prep time)
- [ ] **Fund wallet** near 15h from treasury — enough for `0.0105 ETH` total (`0.01` buy + `0.0005` launch fee) + gas buffer
- [ ] **Broadcast** `launchAndBuy` — same command with `--broadcast` (NOT `--dry-run`)
- [ ] **Sweep** leftover ETH back to treasury: `npm run factory -- wallet sweep --key-file launches/_wallets/0xbBDE58C5878Df52DDbE08f4C9F18274431546466.json --broadcast`

## Notes

- User Aurel owns X — leave twitter blank until link arrives.
- Do NOT fund early; fund near 15:00.
- Do NOT broadcast until checklist complete.
