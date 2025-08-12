var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');


const {  isAdmin } = require('../utils/auth');

/* Display all Bill orders (order & bill)*/
router.get('/getOrders', isAdmin, async function (req, res) {
    const db = await connectToDB();
    try {
      let query = {};
      let pipelines = [];
      let page = parseInt(req.query.page) || 1;
      let perPage = parseInt(req.query.perPage) || 10;
      let skip = (page - 1) * perPage;
  
      pipelines = pipelines.concat([
  
        {
          $lookup: {
            from: "Bill",
            localField: "BillNo",    // field in the orders collection
            foreignField: "BillNo",  // field in the items collection
            as: "fromItems"
          }
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"] } }
        },
        { $project: { fromItems: 0 } }]
  
  
      );
  
  
  
      if (req.query.BillNo) {
        console.log(req.query.BillNo);
        pipelines.push({ $match: { BillNo: { $regex: req.query.BillNo } } });
      } else pipelines.push({ $skip: skip }, { $limit: perPage });
  
      let result = await db.collection("Order").aggregate(pipelines).toArray();
      //let result = await db.collection("Order").find(query).skip(skip).limit(perPage).toArray();
      let total = await db.collection("Order").countDocuments(query);
  
  
      res.json({ orders: result, total: total, page: page, perPage: perPage });
  
  
  
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      await db.client.close();
    }
  });
  


// Delete a single order
router.delete('/deleteOrder/:id', isAdmin, async function (req, res) {
    const db = await connectToDB();
    try {
  
      console.log("del");
      console.log("del" + req.params.id);
      let result = await db.collection("Order").deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Order deleted" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      await db.client.close();
    }
  });

  
// Update a single order
router.put('/updateOrder/:id', isAdmin, async function (req, res) {
  const db = await connectToDB();
  try {

    console.log("update");
    console.log("update" + req.params.id);
    let result = await db.collection("Order").updateOne({ _id: new ObjectId(req.params.id) },
            {
                $set: req.body 
            });

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Order updated" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }


  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

  module.exports = router;