//const API_ENDPOINT = process.env.API_ENDPOINT
let URL = `http://localhost:5000`
if (process.env.NODE_ENV == 'production') {
    URL = `http://34.68.151.162:5000`
}
export const BACKEND_URL = URL