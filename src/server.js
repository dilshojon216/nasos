const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const WaterPumpRouter = require('./routes/water_pump_route.js');
const userRouter = require('./routes/user.route');
const WaterPump = require('../src/models/waterPump.model');
const app = express();
const DataWrite=require('../src/controllers/data_write')
dotenv.config();
const mqtt = require("mqtt");

var clinet = mqtt.connect("mqtt://185.196.214.190:1883", {
  clientId :`js_${Math.random().toString(16).slice(3)}`,
  username: process.env.MQTTUSERNAME,
  password: process.env.MQTTPASSWORD,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  clean: true,
});

app.use(express.json());

app.options("*", cors());

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/waterPump`, WaterPumpRouter);

app.get('/', (req, res) => { 
    res.send('Hello World!');
});
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);  
})
app.use(errorMiddleware);


clinet.on("connect", function () {
    clinet.subscribe(process.env.TOPIC, function (err) {
        if (!err) {
            console.log(process.env.TOPIC + " subscribe success");
        } else {
            console.log(err.message);
        }
    });    
});

clinet.on("message", function (topic, message) {
        getData(message.toString())
});

async function getData(message) {
    console.log(message);

    try {
        
        let topic
        let avg_level
        let volume
        let dataString = message.toString().substring(1, message.toString().length - 1);
        let dataList = dataString.split(",")
        if (dataList.length == 9) {
            firstDataList= dataList[0].split("/")
            topic = firstDataList[0];
            if (firstDataList[1]=="RG4122") {
                var dataWaterPump = await WaterPump.findOne({ topic: topic });
                if (dataWaterPump) {
                    
                    let flow1 = dataList[1].substring(3)
                    let flow2 = dataList[2].substring(3)
                    
                    avg_level = parseFloat(flow1) + parseFloat(flow2)
                    let todayFlow1 = dataList[3].substring(3)
                    let todayFlow2 = dataList[3].substring(3)
                    
                    todayFlowTutle = parseFloat(todayFlow1) + parseFloat(todayFlow2)
                    let lastToday=0.0
                    if (dataWaterPump['volume_today']!="") {
                        lastToday=parseFloat(dataWaterPump['volume_today'])
                    }
                    volume=todayFlowTutle-lastToday
                  
                    dataWaterPump['volume_today'] = todayFlowTutle
                    await WaterPump.update(dataWaterPump, dataWaterPump['id'])
                    
                    const dataSend = {
                        "code": dataWaterPump["code"].toString(),
                        "data": {
                            "avg_level": avg_level,
                            "volume": volume,
                            "vaqt": getTime()
                        }
                    }
                    console.log(dataSend)
                    await DataWrite.dataWrite(dataSend)
                    
                }
                
            }
        }
        
    } catch (error) {
        console.log(error)
    }
    
}

function getTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }   
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }   
        var dateTime =year+ month+day+hour+minute;   
         return dateTime;
    }


app.listen(port, () =>
    console.log(`Server running on port ${port}!`));

