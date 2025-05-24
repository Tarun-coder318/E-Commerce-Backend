const { expressjwt: expressJwt } = require('express-jwt');


function authJwt() {
    const JWT_SECRET = process.env.JWT_SECRET;
    const API = process.env.API_URL;
    return expressJwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'],
    }).unless({
      path: [
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
          { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
        `${API}/users/login`,
        `${API}/users/register`,

      ]
    })
}

module.exports = authJwt;
