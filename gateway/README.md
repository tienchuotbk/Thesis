## [Environment Variables](#environment-variables)

The environment variables should be set in a '.env' file just as .env.sample file. You should set the values of these keys:

```js
# URL of the Mongo DB
DB_URI=DB_URI_HERE

# JWT
# JWT secret key for access token
JWT_SECRET_KEY=JWT_SECRET_KEY_HERE
# JWT secret key for refresh token
REFRESH_TOKEN_SECRET_KEY=REFRESH_TOKEN_SECRET_KEY_HERE

# AWS configurations for S3 and SES services
AWS_REGION=AWS_REGION_HERE
AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID_HERE
AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY_HERE
```

<br />
