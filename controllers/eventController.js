const express = require("express");

exports.getAllEvents = async(req,res,next) => {
    try{
 res.status(200).json({
    status: "Success",
    results: "number of events",
    data: {
      events:"events",
    },
  });    }catch(err){
        console.log("error ");
    }
}