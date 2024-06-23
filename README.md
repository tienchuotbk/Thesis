# Thesis - Job System - ChuotGreen2024

## Table of Contents

<!-- TABLE-OF-CONTENTS:START -->

- [Features](https://github.com/tienchuotbk/Thesis/#features)
- [Environment Variables](https://github.com/tienchuotbk/Thesis/#environment-variables)
- [Project Structure](https://github.com/tienchuotbk/Thesis/#project-structure)
- [API Documentation](https://github.com/tienchuotbk/Thesis/#api-documentation)
- [Error Handling](https://github.com/tienchuotbk/Thesis/#error-handling)
- [Validation](https://github.com/tienchuotbk/Thesis/#validation)
- [Authentication](https://github.com/tienchuotbk/Thesis/#authentication)
- [Authorization](https://github.com/tienchuotbk/Thesis/#authorization)
- [Logging](https://github.com/tienchuotbk/Thesis/#logging)
- [Contributing](https://github.com/tienchuotbk/Thesis/#contributing)
<!-- TABLE-OF-CONTENTS:END -->

<br />

## [Features](#features)

<!-- FEATURES:START -->

- **NoSQL database**: [MongoDB](https://www.mongodb.com/) object data modeling using [Mongoose](https://mongoosejs.com/)
- **Authentication and authorization**: using [JWT](https://jwt.io/) (access and refresh token)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using a log model and storing in the db
- **Error handling**: error handling mechanism with specific result messages and codes
- **Image Uploading**: using [AWS S3 bucket](https://aws.amazon.com/tr/s3/)
- **Email Sending**: for now for verification code by using [nodemailer](https://nodemailer.com/about/) and [AWS SES](https://aws.amazon.com/tr/ses/)
- **Multilanguage Support**: using a util and jsons
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io/)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
<!-- FEATURES:END -->

<br />

## [Environment Variables](#environment-variables)

<b>Web</b>

```js
VITE_PORT = "<VITE_PORT>";
VITE_API_URL = "<VITE_API_URL>";
```

<b>Gateway</b>

```js
PORT = "<PORT>";
DB_URI =
  "mongodb://<username>:<passowrd>@localhost:<port>/<database_name>?retryWrites=true&w=majority&authSource=admin";
```

<br />

## [Project Structure](#project-structure)

```
├─ Home page
│  ├─ List job
│  │  ├─ Job detail
│  ├─ Insignt
│  │  ├─ Map Chart
│  │  ├─ Pie Chart
│  │  ├─ Table Chart
│  │  ├─ Line Chart
```

## [Contribution](#contribution)

Contributions are very, very important for me and for those who want to benefit from this resource. I will be very appreciated if you allocate time to contribute.

**THANK YOU!**