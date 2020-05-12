
module.exports=(function(){
    let seed=async function (seed){
        // console.log("ENV RUNNING IS:- ",process.env.NODE_ENV);
        // if(seed){
        //     let SOURCE_DB, sourceClient,targetClient,TARGET_DB;
        //     try {
        //         sourceClient = await MongoClient.connect(MONGO_DB_SOURCE_URL, { useNewUrlParser: true });
        //         let sourceDbName=sourceClient.s.options.dbName;
        //         SOURCE_DB = sourceClient.db(sourceDbName);
        //         try {
        //             targetClient = await MongoClient.connect(MONGO_DB_URL, { useNewUrlParser: true });
        //             let targetDbName=targetClient.s.options.dbName;
        //             TARGET_DB = targetClient.db(targetDbName);
        //             await TARGET_DB.dropDatabase();
        //             let collection=await SOURCE_DB.collections();
        //             if(collection.length){
        //                 for (var c of collection) {
        //                     if(c.s.namespace.collection !="system.indexes" && c.s.namespace.collection !="sessions"){
        //                         let cm=c.s.namespace.collection;
        //                         console.log(c.s.namespace.collection)
        //                         let data=await SOURCE_DB.collection(cm).find({}).toArray();
        //                         //console.log(data)
        //                         let targetInserted=await TARGET_DB.collection(cm).insertMany(data,{ ordered : false });
        //                         console.log(`collection : ${cm} doc count ${targetInserted.insertedCount}`)
        //                     }
        //                 }
        //             }
        //             console.log('ALL SEED DATA MIGRATED')
        //             targetClient.close();
        //             sourceClient.close();
        //             return true
        //         } catch (err) {
        //             console.log("TARGET ERROR:-",err.message);
        //             return err.message;
        //         } 
        //     } catch (err) {
        //         console.log("SOURCE ERROR:-",err.message);
        //         return err.message;
        //     }
        // }else{
        //     console.log('SEED ALREADY FALSE')
        // }
        
    }
    return {
        seed
    }
})()