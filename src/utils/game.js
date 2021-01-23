
const BaseScore = 20

const computeScore = (cards) => {
  let score = 0
  let totalCount = cards.length

  if (totalCount === 0) {
    return score
  }

  let investmentCount = cards.filter(card => {
    return card.type === 'investment'
  }).length

  cards.forEach(card => {
    if (card.type === 'normal') {
      score += card.value
    }
  })

  if (investmentCount > 0) {
    // 投资卡数量与倍数的关系
    let multiple = investmentCount + 1
    score = (score - BaseScore) * multiple
  } else {
    score = (score - BaseScore)
  }

  if (totalCount >= 8) {
    score += 20
  }

  return score
}

export { computeScore }
