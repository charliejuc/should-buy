import fs from 'fs'
import csvParse from 'csv-parse'
import { csvBufferToPurchaseScores } from './Parser'

const filePath = process.argv[2]
// const filePath = path.join(__dirname, '..', 'files', 'purchases_2021-02.csv')

if (!filePath) {
    console.error('"filePath" parameter is required')
    process.exit(1)
}

const main = async (): Promise<void> => {
    const fileBuffer = await fs.promises.readFile(filePath)

    const parser = csvParse({
        delimiter: ',',
        columns: true
    })

    const results = await csvBufferToPurchaseScores(parser, fileBuffer)

    console.log(results)
}

main().catch(console.error)
