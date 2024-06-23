import mongooseLoader from '../loaders/mongoose.js';
import createCompanyDb from './handlers/create-company-db.js'
import updateNumberJobOfCompany from './handlers/update-number-job-of-company.js'

async function main() {
    await mongooseLoader()
    try {
        const cmd = process.argv[2]
        switch (cmd) {
            case "create-company-db":
                await createCompanyDb()
                break;
            case "update-number-job-of-company":
                await updateNumberJobOfCompany()
                break;
            default:
                console.log("invalid cmd!")
                break;
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(1)
}

main()