# Raw Feedback — Michael E. Usability Session

> Verbatim report preserved unedited. For synthesis and analysis see `report.md`.

**Date:** 6 April 2026
**Flow tested:** Full two-run session — first run via photo scan (8 items), second run via manual entry (8 different items)
**Device context:** Tablet / phone simulation (fast-casual floor operator perspective)

---

## Full Verbatim Report

### What happened when I clicked “Analyze another menu”

> "The reset was instant. Clean slate. No lag, no confirmation dialog. That's the right call — in a fast-casual environment I don't have time for pop-ups asking 'are you sure?' It just cleared everything and took me back to the input form. Good."

> "The form defaulted to 'Select your type (optional)' — so I had to pick QSR/Fast Food again. Small thing, but it would be smarter to remember my previous selection. If I'm running the same shop every time, that's one unnecessary click on every session."

### Entering items manually — where the friction is

> "This is where I felt the real usability gap. For the second menu I typed in 8 items manually — names, prices, and food cost percentages. Here's what I noticed:"

> "The 'Add item' button works fine and adds rows cleanly. No issues there. But the analyse button is completely hidden below the fold when you have more than 5–6 items. I couldn't see it on screen at all — I had to use a scroll reference to find and click it. For a manager at a counter using a tablet or phone, if that button isn't visible, there's a real chance they don't know the form is complete and ready to submit. There's no sticky CTA at the bottom of the screen, no visual indicator that you're done. That's a usability miss."

> "Also: the food cost % didn't pre-fill for the new rows I added via '+ Add item.' The first three rows started with 27% (correct for QSR), but when I hit '+ Add item' five more times, those new rows had a placeholder of 40% instead of 27%. Inconsistency in default values is the kind of thing that causes a manager to accidentally submit wrong data without noticing."

### The second report itself

> "8 items analyzed. Average contribution margin: $5.47. Results:
> Stars (0) — again, empty. Two analyses in a row with no Stars is worth flagging. The tool still says nothing about it.
> Puzzles (3) — Smash Double ($7.14 margin), Chicken Tenders ($5.85), Late Night Combo ($9.94). All above avg margin, all above avg price = estimated low popularity.
> Plowhorses (5) — Smash Single, Animal Fries, Loaded Tots, Milkshake, Fountain Drink. All below avg margin. Advice: raise prices by $1–2 across the board.
> Dogs (0) — nothing to cut."

> "One visual bug I noticed: the Puzzles card had a blank gap at the top — empty space before SMASH DOUBLE appeared. It looked like a missing item card that didn't render. Minor, but it looks broken and would confuse a non-technical user."

> "The Fountain Drink being flagged as a Plowhorse with a 'Raise price' recommendation is a good catch — $2.50 at 15% food cost is still only $2.12 margin, and drinks are genuinely underpriced in most fast-casual shops. That's an actionable insight."

> "The Late Night Combo at $9.94 margin being a 'Puzzle' is interesting — it's the highest-margin item on the menu, which makes sense for a combo. But the advice to 'move it higher on the menu or add a compelling description' is the same template again. No differentiation in advice quality between a $0.73 sauce and a $9.94 combo."

### Overall usability verdict

> "The core flow works — scan or type, hit analyse, get results. Two-step, minimal friction. That's the right architecture for a busy operator."

> "But the manual entry experience needs work, specifically: the hidden analyse button when the list gets long, the inconsistent food cost % defaults on new rows, and the repeating blank space bug in the Puzzles card. These aren't dealbreakers but they're the kind of rough edges that make a manager abandon a tool after one try."

> "The Scan menu feature remains the killer feature here. Manual entry is slow and error-prone. If scan works reliably, most of these friction points disappear. But if the scan fails or a manager wants to test a hypothetical menu, they're stuck with a manual process that isn't quite polished yet."
