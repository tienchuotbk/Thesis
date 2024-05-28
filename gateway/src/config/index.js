import 'dotenv/config'

const { PORT, DB_URI } = process.env
export const port = PORT || 3000
export const dbUri = DB_URI || ""
export const prefix = '/api'