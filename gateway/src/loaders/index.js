import mongooseLoader from "./mongoose.js"
import expressLoader from './express.js'
// import createIndex from "./elastic.js"
export default async (app) => {
    await mongooseLoader()
    // await createIndex("thesis")
    expressLoader(app)
}