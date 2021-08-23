require('dotenv').config()
import axios from 'axios'

import * as fs from 'fs'

/**
 * Gets data from reddit dependind on .env file
 * @returns data from axios request
 */
async function getToken(): Promise<{
  access_token: string;
}> {
    return axios
        .post(
            'https://www.reddit.com/api/v1/access_token',
            `grant_type=password&username=${process.env.REDDIT_USERNAME}&password=${process.env.REDDIT_PASSWORD}`,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                params: {
                    scope: 'read',
                },
            }
        )
        .then((r) => r.data)
}

// Run the and store the data into token.json
getToken().then((data) =>
    fs.writeFileSync('token.json', JSON.stringify(data))
)

