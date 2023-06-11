const maria = require('mysql');

const pool = maria.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'root',
    database:'연결할 디비명',
    connectionLimit: 20
});

function getConnection(callback){
    console.log(`현재 Connection Pool 내에서 사용 중인 연결 객체의 개수: ${pool._allConnections.length}`);
    pool.getConnection(function(err, conn){
        if(err){throw err;}
        callback(conn);
    });
}

module.exports = getConnection;