const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const maria = require('./maria.js');
const port = process.env.PORT || 3005;

const app = express();
app.use(cors({
    origin: true, // 출처 허용 옵션
    //credential: true // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}));
app.use(helmet());
app.use(morgan('combined'));

//app.listen(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});

app.use((req, res, next) => {
    req.startDate = new Date();
    next();
});

app.get('/', (req, res, next) => {
    res.json({
        success: true,
    });
    next();
});

app.get('/select', (req, res, next) => {
    function add(a,b,callback){
        var result = a+b;
        callback(result);
 
        var count = 0;
        var history = function(){
            count++;
            return count + ':' + a + '+' + b + '=' + result;
        };
        return history;
    }

    var add_his = add(10,10,function(r){
        console.log('파라미터로 전달된 콜백함수 호출');
        console.log('결과 : %d',r);
    });

    console.log('결과로 받은 함수 실행 결과 : ' + add_his());
    console.log('결과로 받은 함수 실행 결과 : ' + add_his());
    console.log('결과로 받은 함수 실행 결과 : ' + add_his());

    
    maria((conn) => {
        try {
            conn.query('SELECT * FROM inquiry', function(err, rows, fields){
                res.send(rows);
            });
        } catch (error) {
            console.log("db error");
            res.send(err);
        } finally{
            conn.release();
        }
    });
    next();
});

app.use((req, res) => {
    req.endDate = new Date();
    console.log("Path - "+req.url+", "+(req.endDate-req.startDate)+"ms");
});