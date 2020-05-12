const addSubtractDate = require("add-subtract-date");
const deliveryTimeSetting=60;
const request=require('request');
const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();
module.exports = (function (app) {
  async function graphDataModification(date,data){
    let arr=[];
    arr.push({date:date.getDate(),month:date.getMonth()+1,year:date.getFullYear(),total:0})
    let date1=addSubtractDate.add(date, -1, 'day');
    arr.push({date:date1.getDate(),month:date1.getMonth()+1,year:date1.getFullYear(),total:0})
    let date2=addSubtractDate.add(date, -1, 'day');
    arr.push({date:date2.getDate(),month:date2.getMonth()+1,year:date2.getFullYear(),total:0})
    let date3=addSubtractDate.add(date, -1, 'day');
    arr.push({date:date3.getDate(),month:date3.getMonth()+1,year:date3.getFullYear(),total:0})
    let date4=addSubtractDate.add(date, -1, 'day');
    arr.push({date:date4.getDate(),month:date4.getMonth()+1,year:date4.getFullYear(),total:0})
    let date5=addSubtractDate.add(date, -1, 'day');
    arr.push({date:date5.getDate(),month:date5.getMonth()+1,year:date5.getFullYear(),total:0})
    let date6=addSubtractDate.add(date, -1, 'day');
    arr.push({date:date6.getDate(),month:date6.getMonth()+1,year:date6.getFullYear(),total:0})
    let p=new Promise(function (resolve) {
      let dateArr=[],totalArr=[];
      arr.forEach(function(element){
        var found = data.find(function(findElement) {
          return element.date==findElement._id.date;
        });
        if(found){
          totalArr.push(found.data)
          dateArr.push(found._id.date+"/"+found._id.month+"/"+found._id.year)
        }else{
          totalArr.push(element.total)
          dateArr.push(element.date+"/"+element.month+"/"+element.year)
        }
      })
      resolve({totalArr,dateArr})
    });
    return p
  }
  async function setDate(timestamp){
      let arr=[];
      let date=new Date(Number(timestamp));
      arr.push({date:date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear(),dayCode:date.getDay()})
      let date1=addSubtractDate.add(date, 1, 'day');
      arr.push({date:date1.getDate()+"-"+(date1.getMonth()+1)+"-"+date1.getFullYear(),dayCode:date.getDay()})
      let date2=addSubtractDate.add(date, 1, 'day');
      arr.push({date:date2.getDate()+"-"+(date2.getMonth()+1)+"-"+date2.getFullYear(),dayCode:date.getDay()})
      let date3=addSubtractDate.add(date, 1, 'day');
      arr.push({date:date3.getDate()+"-"+(date3.getMonth()+1)+"-"+date3.getFullYear(),dayCode:date.getDay()})
      let date4=addSubtractDate.add(date, 1, 'day');
      arr.push({date:date4.getDate()+"-"+(date4.getMonth()+1)+"-"+date4.getFullYear(),dayCode:date.getDay()})
      let date5=addSubtractDate.add(date, 1, 'day');
      arr.push({date:date5.getDate()+"-"+(date5.getMonth()+1)+"-"+date5.getFullYear(),dayCode:date.getDay()})
      let date6=addSubtractDate.add(date, 1, 'day');
      arr.push({date:date6.getDate()+"-"+(date6.getMonth()+1)+"-"+date6.getFullYear(),dayCode:date.getDay()})
      return arr;
  }
  async function workingTimeCalculation(workingHours,time,timestamp){
    let newOpenTime =time.split(":");
    let tempTime = (Number(newOpenTime[0]) * 60) + Number(newOpenTime[1])
    let newSetTimeArr=[];
    let d=new Date();
    console.log("tempTime",tempTime)
    const setTime=await this.setDate(timestamp);
    setTime.forEach(element => {
      let filter=_.find(workingHours, {dayCode:element.dayCode})
      if(filter && filter.dayCode==d.getDay()){
          if(filter.timeSchedule && filter.timeSchedule.length){
              filter.timeSchedule.forEach(function(timeSlt){
                  if(tempTime>timeSlt.openTimeConverted && (timeSlt.closeTimeConverted-tempTime)<deliveryTimeSetting){
                      console.log("INSIDE...........",timeSlt.openTimeConverted)
                      timeSlt.isClosed=false
                  }
              }) 
          }
      }
      let temp={
          timeSchedule: filter.timeSchedule,
          day: filter.day,
          dayCode: filter.dayCode,
          date:element.date,
          isClosed: filter.isClosed
      }
      newSetTimeArr.push(temp);
    });
    return newSetTimeArr
  }
  function orderPushNotification(device,message,title){
      return new Promise(function(resolve,reject){
        var appID = process.env.OneSignalAppID;
        var secretKey=process.env.OneSignalSecretKey
        request({
          method:'POST',
          uri:'https://onesignal.com/api/v1/notifications',
          headers : {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+secretKey
          },
          json: true,
          body:{
          'app_id': appID,
          'contents': {en: message},
          'headings': { en: title},
          'include_player_ids': Array.isArray(device) ? device : [device]
          }
        },
          function(error, response, body) {
          if(!body.errors){
            console.log(body);
            resolve({message:"push send"})
          }else{
            console.error('Error:', body.errors);
            resolve({message:"push not send"})
          }
          });
      })
      //for all user pushNotification
      
  }
  return {
    setDate,
    workingTimeCalculation,
    orderPushNotification,
    graphDataModification
  }
})();