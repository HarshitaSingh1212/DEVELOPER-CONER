const { kafka } = require('./client');

async function init(){
    const admin = kafka.admin();
    console.log("admin connecting...");
    admin.connect();
    console.log('admin connected');

    await admin.createTopics({
        topics: [
            {
                topic: "rider-updates",
                numPartitions: 0,
            }
        ],
    });

    console.log("topic created successfully");
    
   console.log("disconnecting admin..");
   await admin.disconnect();
}

init();