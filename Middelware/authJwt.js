const { expressjwt: expressJwt } = require('express-jwt');


function authJwt() {
    const JWT_SECRET = process.env.JWT_SECRET;
    const API = process.env.API_URL;
    return expressJwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked: async (req, token) => {
    return !token.payload.isAdmin; // true means revoke
}
    }).unless({
      path: [
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
          { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
        `${API}/users/login`,
        `${API}/users/register`,

      ]
    })
}

// async function isRevoked(req, payload, done) {
//     if (!payload.isAdmin) {
//         done(null, true);
//     }
//     done();
// }

// async function isRevoked(req, payload) {
//     if (!payload.isAdmin) {
        
//     console.log("Decoded Payload:", payload);

//         return true; // Revoke token
//     }
//     return false; // Allow token
// }

module.exports = authJwt;
