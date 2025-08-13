var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/auth');

const shortid = require('shortid');

const today = new Date();
var thisMonth = '';
const thisYear = today.getFullYear;

if (today.getMonth() < 10)
  thisMonth = '0';
thisMonth = thisMonth + today.getMonth();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



// Display food details
router.get('/getFood', async function (req, res) {
  const db = await connectToDB();
  try {

    //let query = { MyName: { $regex: req.query.MyName },Q2_word: { $regex: req.query.Q2_word } };
    let query = {};
    if (req.query.FoodID)
      query = { FoodID: req.query.FoodID };

    let result = await db.collection("Food").find(query).toArray();

    res.json({ food: result });

  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

//Handle the Form - Comments
router.post('/comment', async function (req, res) {

  analyseText = {};
  const db = await connectToDB();
  try {
    console.log("Add new comment", req.body);
    req.body.created_at = new Date();
    analyseText = req.body.analyseText;
    analyseResult = req.body.analyseResult;
    req.body.positive = analyseText.positive;
    req.body.neutral = analyseText.neutral;
    req.body.negative = analyseText.negative;
    delete req.body.analyseText;

    let result = await db.collection("Comment").insertOne(req.body);
    console.log(result);
    //res.status(201).json({ id: result.insertedId, record: req.body});
    //res.render('review');
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {

    await db.client.close();

  }
});



// Display all comments
router.get('/getComments', async function (req, res) {
  const db = await connectToDB();
  try {

    //let query = { MyName: { $regex: req.query.MyName },Q2_word: { $regex: req.query.Q2_word } };
    let query = {};

    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let skip = (page - 1) * perPage;

    // if (req.query.comment)
    //  query = { comments: { $regex: req.query.comment } };
    if (req.query.analyseResult)
      query = { analyseResult: req.query.analyseResult };

    let result = await db.collection("Comment").find(query).skip(skip).limit(perPage).toArray();
    let total = await db.collection("Comment").countDocuments(query);


    let pipelines = [];


    pipelines = pipelines.concat([
      {

        $group: {
          _id: null,
          avg_positive: { $avg: "$positive" },
          avg_neutral: { $avg: "$neutral" },
          avg_negative: { $avg: "$negative" },
        }

      }]);

    let score = await db.collection("Comment").aggregate(pipelines).toArray();

    console.log(score);

    res.json({ comments: result, score: score, total: total, page: page, perPage: perPage });



  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


router.get('/surveyStat/', async function (req, res) {

  const db = await connectToDB();
  try {

    let query = {};
    let pipelines = [];


    if (req.query.chart == "donut") {


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

      //pipelines.push({ $match: { "DateTime": { $gte: Date(thisYear + "-" + thisMonth + "-01T00:00:00.000Z") } } });
   

      pipelines.push({
        $group: {
          _id: { FoodName: "$FoodName" },
          Quantity: {
            $sum: "$Qty"
          },

        },

      });

      let result = await db.collection("Order").aggregate(pipelines).toArray();
      res.json(result);


    } else if (req.query.chart == "bar") {


      //pipelines.push({ $match: { "DateTime": { $gt: Date(thisYear+"-" + thisMonth + "-01T00:00:00.000Z") } } });

      pipelines = pipelines.concat([

        //{ $match: { "DateTime": { $gte: { $toDate: "2023-01-01T00:00:00.000Z" } } } },
        {
          $match: {
            $expr: {
              $eq: [{ $year: "$DateTime" }, today.getFullYear()]
            }
          }
        },
        {
          $project: {
            date: {
              $dateToParts: {
                date: "$DateTime",
              },
            },
            TotalPrice: 1,
          },
        },
        {
          $group: {
            _id: {
              date: {
                year: "$date.year",
                month: "$date.month",
              },
            },
            amount: {
              $sum: "$TotalPrice",
            },
          },
        },
      ]);


      let result = await db.collection("Bill").aggregate(pipelines).toArray();
      res.json(result);




    } else { res.json({ status: "OK" }); }






  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


/* Handle the Form - Checkout */
router.post('/CheckOut', async function (req, res) {
  var cartItems = [];
  var cartItem_price = [];
  console.log("Add new bill");
  const db = await connectToDB();
  try {
    console.log("Add new bill", req.body.cartItems);
    console.log("User: ", req.body.Username);
    cartItem_price = req.body.cartItem_price;
    cartItems = req.body.cartItems;

    // insert with Bill No
    const uniqueId = shortid.generate();
    //const uniqueId = ObjectId(); 
    const document = {
      BillNo: uniqueId,
      Username: req.body.Username,
      TotalPrice: req.body.TotalPrice,
      DateTime: new Date()
    };

    let result = await db.collection("Bill").insertOne(document);
    console.log(result);
    //console.log("Document inserted with ID:", result.insertedId);
    console.log("cartItem_price", cartItem_price)

    let countItem = Array.from(cartItems);
    let index = 0;
    let Qty = 0;
    let price = 0;
    for (const item of countItem) {
      price = 0;
      Qty = 0;
      index = cartItems.indexOf(item);
      while (index > -1) { // only splice array when item is found
        cartItems.splice(index, 1); // 2nd parameter means remove one item only
        //console.log("index"+index);
        //console.log("cartItems:"+cartItems);
        //console.log("countItem:"+countItem);



        Qty = Qty + 1;
        price = price + parseInt(cartItem_price[index]);
        console.log("price" + price);
        index = cartItems.indexOf(item);
      }
      if (Qty > 0) {
        result = await db.collection("Order").insertOne({ BillNo: uniqueId, FoodName: item, Qty: Qty, Price: price });
        console.log("update");
      }
    }



    //res.status(201).json({ id: result.insertedId, record: req.body});
    //res.render('review');
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {

    await db.client.close();

  }
});



//Below all for login//
//////////////////////////////////////////////////

router.post('/login', async function (req, res, next) {
  const db = await connectToDB();
  try {

    var user = await db.collection("users").findOne({ Username: req.body.Username, Password: req.body.Password });
    if (!user) {
      res.status(401).json({ message: 'User not found or password incorrect!' });
      return;
    }

    // res.json(user);


    // generate a JWT token
    const token = generateToken(user);
    delete user.password;
    delete user.ip_address;

    // return the token
    res.json({ token: token });

  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
/////////////////////////////////////////////
//Registration form
router.post('/customer', async function (req, res) {

  const db = await connectToDB();
  try {


    let result = await db.collection("users").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

module.exports = router;


