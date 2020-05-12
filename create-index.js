const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;
const consoleInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let connectionUrl = null;
consoleInterface.question("\x1b[36m%s\x1b[0mEnter the Mongo DB connection uri string : ", (answer) => {
    connectionUrl = answer;
    consoleInterface.close();
});

consoleInterface.on('close', () => {
    if (connectionUrl) {
        connectToDB();
    } else {
        console.log("\x1b[31mCOULT NOT CREATE DATABASE INDEX FOR CATEGORY, PRODUCT AND OFFERS");
        process.exit(0);
    }
});

async function connectToDB() {
    try {
        const db = await MongoClient.connect(connectionUrl);
        const categoryIndex = await db.db('test').collection('categories').createIndex({
            title: "text",
            description: "text"
        });
        console.log("\x1b[32mCATEGORY COLLECTION INDEX", categoryIndex);
        const productIndex = await db.db('test').collection('products').createIndex({
            title: "text",
            description: "text"
        });
        console.log("\x1b[32mPRODUCT COLLECTION INDEX", productIndex);
        const offerIndex = await db.db('test').collection('coupons').createIndex({
            couponCode: "text",
            description: "text",
            couponType: "text"
        });
        console.log("\x1b[32mOFFER COLLECTION INDEX", offerIndex);
        process.exit(0);
    } catch (e) {
        console.log("\x1b[31mCOULD NOT CONNECT TO DATABASE");
        console.log(e);
    }
}

// connectToDB();
