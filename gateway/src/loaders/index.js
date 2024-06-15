import mongooseLoader from "./mongoose.js"
import expressLoader from './express.js'
import clickHouseLoader from './clickhouse.js'
export default async (app) => {
    await mongooseLoader()
    await clickHouseLoader()
    expressLoader(app)
}