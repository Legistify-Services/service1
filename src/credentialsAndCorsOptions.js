const allowedOrigins = [
    "https://auth-frontend-dev.legistrak.com",
    "https://service1-frontend-dev.legistrak.com",
  //   "http://127.0.0.1:5500",
  //   "http://localhost:5008",
  //   "http://localhost:3000",
  ];
  
export const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Credentials", true);
    }
    next();
  };


export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  exposedHeaders: "x-auth-token",
  optionsSuccessStatus: 200,

};
