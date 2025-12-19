const jwt = require("jsonwebtoken")
 //撒盐，加密时候混淆
 const secret = '123bingjspoiuytrewqlkjhgfdsa'

const jwtObj = {} 

function createToken(info) {
    let token = jwt.sign(info, secret, {
        expiresIn: "365d"
    })
    jwtObj[info.userName] = token
    return token
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, result) => {
            if(error){
                reject(error)
            } else {
                resolve(result)
            }
      })
    })
}


module.exports = {
    createToken,
    verifyToken,
    extend: function(target, source, flag) {
        for(var key in source) {
            if(source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },
    jwtObj
}