import R from 'ramda'
import randomInt from 'random-int'
import { purchaseScore, purchaseScoreFactory, toFixedNumber } from '../PurchaseScore'
import { csvRecordToPurchaseScore, headers } from '../Parser'

const config = {
    weights: {
        wishScore: 2,
        workScore: 3,
        healthScore: 4,
        salaryDamageScore: 3,
        newDecisionScore: 1
    }
}

it('buyScore1 should be greater than buyScore2', () => {
    const buyScore: ReturnType<typeof purchaseScoreFactory> = R.compose(
        toFixedNumber(2),
        purchaseScoreFactory(
            config.weights.wishScore,
            config.weights.workScore,
            config.weights.healthScore,
            config.weights.salaryDamageScore,
            config.weights.newDecisionScore
        ) as (...args: number[]) => number
    )

    const buyScore1 = buyScore(
        randomInt(5, 10),
        randomInt(5, 10),
        randomInt(5, 10),
        randomInt(0, 5),
        randomInt(0, 5)
    )
    const buyScore2 = buyScore(
        randomInt(0, 5),
        randomInt(0, 5),
        randomInt(0, 5),
        randomInt(5, 10),
        randomInt(5, 10)
    )

    expect(buyScore1).toBeGreaterThan(buyScore2)
})

it('buyScore1 should be greater than buyScore2 - Max Health Score', () => {
    const buyScore: ReturnType<typeof purchaseScoreFactory> = R.compose(
        toFixedNumber(2),
        purchaseScoreFactory(
            config.weights.wishScore,
            config.weights.workScore,
            config.weights.healthScore,
            config.weights.salaryDamageScore,
            config.weights.newDecisionScore
        ) as (...args: number[]) => number
    )

    const buyScore1 = buyScore(
        randomInt(5, 10),
        randomInt(5, 10),
        10,
        randomInt(0, 5),
        randomInt(0, 5)
    )
    const buyScore2 = buyScore(
        randomInt(0, 5),
        randomInt(0, 5),
        randomInt(0, 5),
        randomInt(5, 10),
        randomInt(5, 10)
    )

    expect(buyScore1).toBeGreaterThan(buyScore2)
})

it('buyScore1 should be less than buyScore2 - Max SalaryDamage Score', () => {
    const buyScore: ReturnType<typeof purchaseScoreFactory> = R.compose(
        toFixedNumber(2),
        purchaseScoreFactory(
            config.weights.wishScore,
            config.weights.workScore,
            config.weights.healthScore,
            config.weights.salaryDamageScore,
            config.weights.newDecisionScore
        ) as (...args: number[]) => number
    )

    const buyScore1 = buyScore(
        randomInt(0, 5),
        randomInt(0, 5),
        randomInt(0, 5),
        10,
        randomInt(5, 10)
    )
    const buyScore2 = buyScore(
        randomInt(5, 10),
        randomInt(5, 10),
        randomInt(5, 10),
        randomInt(0, 5),
        randomInt(0, 5)
    )

    expect(buyScore1).toBeLessThan(buyScore2)
})

it('buyScore1 should be equals to buyScore2', () => {
    const buyScore: ReturnType<typeof purchaseScoreFactory> = R.compose(
        toFixedNumber(2),
        purchaseScoreFactory(
            config.weights.wishScore,
            config.weights.workScore,
            config.weights.healthScore,
            config.weights.salaryDamageScore,
            config.weights.newDecisionScore
        ) as (...args: number[]) => number
    )

    const params1 = [
        randomInt(0, 10),
        randomInt(0, 10),
        randomInt(0, 10),
        randomInt(0, 10),
        randomInt(0, 10)
    ]

    const buyScore1 = R.apply(buyScore)(params1)
    const buyScore2 = R.apply(buyScore)(params1)

    expect(buyScore1).toBe(buyScore2)
})

it('buyScore1 should be equals to buyScore2 - 0 healthScore weight', () => {
    const buyScore: ReturnType<typeof purchaseScoreFactory> = R.compose(
        toFixedNumber(2),
        purchaseScoreFactory(
            config.weights.wishScore,
            config.weights.workScore,
            0,
            config.weights.salaryDamageScore,
            config.weights.newDecisionScore
        ) as (...args: number[]) => number
    )

    const params1 = [randomInt(5, 10), randomInt(5, 10), 10, randomInt(0, 5), randomInt(0, 5)]
    const params2 = R.update(2, 0, params1)

    const buyScore1 = R.apply(buyScore)(params1)
    const buyScore2 = R.apply(buyScore)(params2)

    expect(buyScore1).toBe(buyScore2)
})

it('"csvRecordToPurchaseScore" correct result', () => {
    const record: Record<headers, string> = {
        name: Math.random().toString(32).slice(2),
        wishScore: `${randomInt(0, 10)}`,
        workScore: `${randomInt(0, 10)}`,
        healthScore: `${randomInt(0, 10)}`,
        salaryDamageScore: `${randomInt(0, 10)}`,
        newDecisionScore: `${randomInt(0, 10)}`
    }

    const result = csvRecordToPurchaseScore(record)

    expect(result).toStrictEqual({
        name: record.name,
        score: purchaseScore(
            Number(record.wishScore),
            Number(record.workScore),
            Number(record.healthScore),
            Number(record.salaryDamageScore),
            Number(record.newDecisionScore)
        )
    })
})
