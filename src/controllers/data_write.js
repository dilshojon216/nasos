var request = require('request');
const dotenv = require('dotenv');
dotenv.config();
class DataWriteServer{
  dataWrite = async (dataSend) => {
    request.post({
      headers: {
        'content-type': 'application/json',
      },
      uri: process.env.URLBASE,
      body: dataSend,
      json: true
    }, function (error, response, body) {
        if(error){
            console.log(error)
      }
      if (body) {
        console.log(response.body)
        
      }
    });
   }
}
module.exports =new DataWriteServer;