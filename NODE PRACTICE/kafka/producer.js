const { kafka } = require('./client');
async function init(){
    const producer = kafka.producer();

    console.log('connecting producer');
    await producer.connect();
     
       await producer.send({
        topic:'rider-updates',
        messages:[
           { 
            key:'location-update',value:JSON.stringify({
            name:'khushi',
            location:'Bhopal'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'Poorva',
            location:'khadva'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'Dev',
            location:'Kanpur'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'Sumit',
            location:'Bhopal'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'Keval',
            location:'ahemdabaad'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'riya',
            location:'Gandhi nagar'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'neha',
            location:'Gandhi nagar'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'ukemsh',
            location:'Gandhi nagar'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'rohan',
            location:'Gandhi nagar'
           })
        },
        { 
            key:'location-update',value:JSON.stringify({
            name:'sahil',
            location:'Gandhi nagar'
           })
        },
        ],
    });
    await producer.disconnect();
}

init();