import R from 'ramda'
import { config } from './Config'

// exponential range from 1 to n, if exponent is equal to pivot then function returns pivotValue
// pivot 0 value is not allowed
const exponentialPivot = R.curry(
    (pivot: number, pivotValue: number, exponent: number): number =>
        pivotValue ** (exponent / pivot)
)

export const toFixedNumber = R.curry((toFixed: number, value: number): number =>
    Number(value.toFixed(toFixed))
)
const exponentialPivotFixed = R.curry((toFixed: number, pivot: number, pivotValue: number): ((
    value: number
) => number) => R.compose(toFixedNumber(toFixed), exponentialPivot(pivot, pivotValue)))

const applyExponentialWeight: (x: number, y: number) => number = R.compose(
    exponentialPivotFixed(2)(30)(25),
    R.multiply
)

export const purchaseScoreFactory = (
    wishScoreWeight: number,
    workScoreWeight: number,
    healthScoreWeight: number,
    salaryDamageScoreWeight: number,
    newDecisionScoreWeight: number
) => (
    wishScore: number,
    workScore: number,
    healthScore: number,
    salaryDamageScore: number,
    newDecisionScore: number
): number =>
    R.useWith(R.subtract, [R.sum, R.sum])([
        R.multiply(wishScore, wishScoreWeight),
        R.multiply(workScore, workScoreWeight),
        applyExponentialWeight(healthScore, healthScoreWeight)
    ])([
        applyExponentialWeight(salaryDamageScore, salaryDamageScoreWeight),
        R.multiply(newDecisionScore, newDecisionScoreWeight)
    ])

const purchaseScore: ReturnType<typeof purchaseScoreFactory> = R.compose(
    toFixedNumber(2),
    purchaseScoreFactory(
        config.weights.wishScore,
        config.weights.workScore,
        config.weights.healthScore,
        config.weights.salaryDamageScore,
        config.weights.newDecisionScore
    ) as (...args: number[]) => number
)
