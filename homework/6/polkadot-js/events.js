const { ApiPromise } = require('@polkadot/api');
const mysql  = require('mysql');

var connection = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'root',              
    password : 'xxxxx',       
    port: '3306',                   
    database: 'kitties' 
  }); 

connection.connect();

// 定义 sql 语句 (意思意思，就不去架构了数据库了)
let  addEventSql = 'INSERT INTO kitties_events(xxx,xxx,xxx,xxx) VALUES(?,?,?,?)';
let  addEventSqlParams = ["", "", "", ""];

async function main () {
    // Create the API and wait until ready
    const api = await ApiPromise.create({
        types: {
            KittyIndex: {
            "KittyIndex": "u32",
            }
        }
    });

// Subscribe to system events via storage
api.query.system.events((events) => {
    console.log('----- Received ' + events.length + ' event(s): -----');
    // loop through the Vec<EventRecord>
    events.forEach((record) => {
    // extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;
      // show what we are busy with
      console.log(event.section + ':' + event.method + '::' + 'phase=' + phase.toString());
      console.log(event.meta.documentation.toString());
      // loop through each of the parameters, displaying the type and data
      event.data.forEach((data, index) => {
        console.log(types[index].type + ';' + data.toString());
        // 如果检测跟小猫kitties相关事件，就往数据库里写入。
        // ... ...
      });
    });
  });

}

main().catch(console.error);