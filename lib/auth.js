//토큰 검증 모듈
const jwt = require("jsonwebtoken");
var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
//f@i#n%tne#ckfhlafkd0102test!@#%
const authMiddleware = (req, res, next) => { //req에서 res으로 가는 중간 과정 (사용자가 맞는지 검수)
  const token = req.headers["ourtoken"] || req.query.token; //보호를 위한 ticket 발급
  console.error(token);
  if (!token) {
    return res.status(403).json({
      server: "우리서버",
      success: false,
      message: "not logged in",
    });
  }
  // 비동기 특징 때문에 일을 순서대로 처리하려고 promise 사용 (callback은 어느순간 한계가 있다)
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, tokenKey, (err, decoded) => { //token key가 일치하는지 검증
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error) => {
    console.log(error);
    res.status(403).json({ //token에 에러가 있을 때
      server: "우리서버",
      success: false,
      message: error.message,
    });
  };

  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
