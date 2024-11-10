const { kafka } = require('./client');
const group = process.argv[2];
async function init(){
    const consumer = kafka.consumer({groupId:group,autoOffsetReset: "latest"});
    await consumer.connect();

    await consumer.subscribe({topics:['rider-updates']});

    await consumer.run
    ({
        eachMessage: async({topic, partition, message, heartbeat, pause})=>{
          
          
            console.log(`${group} [${topic}]: PART:${partition}: offset:${message.offset}`,message.value.toString());
                await new Promise(resolve => setTimeout(resolve, 3000));
           
        }
    })
}

init();