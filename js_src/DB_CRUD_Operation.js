//This script is used to find, add, delete, update in Mongo DB (CRUD) Operation

//To find the query in DB.

function readFunction(query,schemaName) {
const findinMongoDB = new Promise(function (resolve, reject) { //Promise will return pending, success or failure status.
    schemaName.find(query, function (err, data) {  //In data will get the user detail. 
      console.log(data.length);
      if (data.length === 0) {
          resolve(data);
      }
      else if (data.length > 0){
          resolve(data);
          } 
      else{
          reject(err);
      }
      });     
});
    return findinMongoDB;
}

const a = "dup Function";

module.exports = {readFunction, a}
