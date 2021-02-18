import csvParse from 'csv-parse'
import { purchaseScore } from './PurchaseScore'

export type headers =
    | 'name'
    | 'wishScore'
    | 'workScore'
    | 'healthScore'
    | 'salaryDamageScore'
    | 'newDecisionScore'

export const csvRecordToPurchaseScore = (
    record: Record<headers, string>
): {
    name: string
    score: number
} => {
    return {
        name: record.name,
        score: purchaseScore(
            Number(record.wishScore),
            Number(record.workScore),
            Number(record.healthScore),
            Number(record.salaryDamageScore),
            Number(record.newDecisionScore)
        )
    }
}

export const csvBufferToPurchaseScores = (
    parser: csvParse.Parser,
    csvBuffer: Buffer
): Promise<
    Array<{
        name: string
        score: number
    }>
> => {
    return new Promise((resolve, reject) => {
        const results: Array<{
            name: string
            score: number
        }> = []

        parser.on('readable', () => {
            let record = parser.read() as Record<headers, string>

            while (record) {
                results.push(csvRecordToPurchaseScore(record))
                record = parser.read() as Record<headers, string>
            }
        })

        parser.on('end', () => {
            resolve(results.sort((recordA, recordB) => recordB.score - recordA.score))
        })

        parser.on('error', reject)

        parser.write(csvBuffer)

        parser.end()
    })
}
