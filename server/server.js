const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// DB 연결 (이 줄에서 db.js가 실행되며 Mongo 연결)
require('./db');

const passport = require('./config/passport');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://fullweb-beta.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log('❌ CORS 차단됨: ', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

const isProd = process.env.NODE_ENV === 'production';
app.set('trust proxy', 1);

app.use(
  session({
    secret: '암호화에 쓸 비번',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: 'Cluster0',
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// 테스트용 API
app.get('/api/hello', (req, res) => {
  res.json({ msg: 'Node + MongoDB 연결 완료' });
});

// 라우터 연결
app.use('/', authRouter);     // /SignUp, /login, /me, /logout
app.use('/posts', postsRouter); // /posts, /posts/:id, /posts/mine ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});



// 추가할 기능: 관리자권한, 댓글기능, 검색기능, 페이지 나누기, 아마존에 베포하기
// 완성한 기능: 회원가입, 로그인(세션, 접근권한), post CRUD, 디테일페이지, 마이페이지, 이미지업로드(아마존)