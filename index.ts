import axios from 'axios'
const rateLimit = require('axios-rate-limit')
import * as fs from 'fs'
require('dotenv').config()

// We use axios.create to also use the rateLimiter module
const api = rateLimit(
    axios.create({
        baseURL: 'https://oauth.reddit.com',
        headers: {
            Authorization: `Bearer ${
                JSON.parse(fs.readFileSync('token.json', 'utf-8')).access_token
            }`,
        },
    }),
    {

        maxRequests: 60,
    }
)

/**
 * Write's the data into a file calloed users.txt
 * @param data An array of users
 */
const writeData:Function = async (data:Array<any>):Promise<void> => {
    // console.log(data)
    data.forEach( function(post:any) {
        fs.appendFileSync('users.txt', `${post.data.author}\n`)
    })

}

/**
 * 
 * @param api Axios connection
 * @param callback Function after getting the data. In this case to write it to a file called user.txt
 * @returns boolean, depending on if it works or not
 */
const getUsers = async (api:any, callback:Function):Promise<boolean> => {
    try {
        const results:any = await api.get(`/r/${process.env.SUBREDDIT}/hot.json`)
        const posts:Array<any> = results.data.data.children
        callback(posts)
        return true
    }
    catch (e) {
        console.error(e)
        return false
    }
}

// Write the data
if (getUsers(api,writeData)) console.log("File was written")
else console.error("Couldn't write the user.txt file")