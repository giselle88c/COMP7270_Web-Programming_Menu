var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');

/*
const today=new Date();
var thisMonth='';
const thisYear=today.getFullYear;

if (today.getMonth() < 10)
  thisMonth = '0';
thisMonth = thisMonth + today.getMonth();
*/

/* Display MY Bill orders*/
router.get('/myOrders', async function (req, res) {
  const db = await connectToDB();
  try {
    let query = {};


    //let query = { BillNo: { $regex: req.query.BillNo },Q2_word: { $regex: req.query.Q2_word } };
    //
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let skip = (page - 1) * perPage;

    let pipelines = [];


    if (req.query.Username)
      pipelines.push({ $match: { Username: req.query.Username } });
    else pipelines.push({ $match: { Username: "" } });


    pipelines = pipelines.concat([

      {
        $lookup: {
          from: "Order",
          localField: "BillNo",    // field in the orders collection
          foreignField: "BillNo",  // field in the items collection
          as: "fromItems"
        }
      }]


    );


    //pipelines.push({$match: { FoodName: "Sushi01" }});
    //pipelines.push({ $skip: skip }, { $limit: perPage });
    let result = await db.collection("Bill").aggregate(pipelines).toArray();
    //let result = await db.collection("Order").find(query).skip(skip).limit(perPage).toArray();
    //let total = await db.collection("Order").countDocuments(query);


    res.json({ orders: result });



  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


module.exports = router;


