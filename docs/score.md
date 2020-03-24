Base score for notes

| judge   | base score |
| ------- | ---------- |
| perfect | 10         |
| great   | 8          |
| good    | 5          |
| bad     | 2          |
| miss    | 0          |

`life -> [0, 100]` , initially `100`

For single / flick / slide (head and tail)

| judge   | life bonus |
| ------- | ---------- |
| perfect | + 1        |
| great   | 0          |
| good    | - 10       |
| bad     | - 20       |
| miss    | - 40       |

For slide among

| judge   | life bonus |
| ------- | ---------- |
| perfect | 0          |
| miss    | - 5        |

`life` affects score by a multiplier

| life     | multiplier |
| -------- | ---------- |
| 90 - 100 | x 10       |
| 80 - 89  | x 9        |
| 60 - 79  | x 8        |
| 30 - 59  | x 6        |
| 0 - 29   | x 3        |

`maxScore = 10'000'000`

`normalizeFactor = maxScore / totalNotes / 10 / 10`

`noteScore = normalizeFactor * baseScore * multiplier`

`totalScore = sum(noteScore)`

Calculate order

1. A note is judged
2. New life is calculated by life bonus
3. note score is calculated by base score and life multiplier

`normalizeFactor` can be multiplied by `unnomalizedTotalScore = sum(baseScore * multipiler)` , which is absolutely an integer to ensure precision

Extra bonus like "pure" (maybe introduced into) can be added directly to total score