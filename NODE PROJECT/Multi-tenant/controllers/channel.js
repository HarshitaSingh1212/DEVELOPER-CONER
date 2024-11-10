const { verifyToken } = require("../middleware/token");
const connection = require("../utilities/database.js");
const findPermission = require("../middleware/find-permission");

async function insertIntoChannel(req, res) {
    const { tenant_id, channel_code, channel_name } = req.body;
    if (!tenant_id || !channel_code || !channel_name) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "FAILED",
            msg: "Tenant ID, channel code, and channel name are required fields."
        }));
    }
    else {
        const query = "INSERT INTO channel (tenant_id, channel_code, channel_name) VALUES (?, ?, ?)";
        await connection.query(query, [tenant_id, channel_code, channel_name])
        .then (([rows])=>{
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "SUCCESS",
                msg: "Channel created successfully."
            }));
        }) 
         .catch((err)=>{
            console.error("Error inserting channel:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "FAILED",
                msg: "Internal server error."
            }));
         }) 
        }

}

async function updateInChannelTable(req, res) {
      
     const channel_id = req.param.channelId;
    const { tenant_id, channel_code, channel_name } = req.body;

    if (!channel_id || (!channel_code && !channel_name)) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "Failed",
            msg: "channel ID and either channel code or channel name are required fields for update."
        }));
    }

    let setClause = "";
    const queryParams = [];

    if (channel_code) {
        setClause += "channel_code = ?, ";
        queryParams.push(channel_code);
    }

    if (channel_name) {
        setClause += "channel_name = ?, ";
        queryParams.push(channel_name);
    }

    if (setClause === "") {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "Failed",
            msg: "No Fields to update"
        }));
    }

    setClause = setClause.slice(0, -2);

    const query = `
        UPDATE channel
        SET ${setClause}
        WHERE tenant_id = ? AND channel_id = ?
    `;

    queryParams.push(tenant_id);
    queryParams.push(channel_id);

    await connection.query(query, queryParams)
        .then((results) => {
            if (results.affectedRows === 0) {

                res.statusCode = 404;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "Channel not found."
                }));
            }
            else {
                res.statusCode = 200;
                res.end(JSON.stringify({
                    status: "Success",
                    msg: "Channel updated successfully."
                }));
            }

        })
        .catch((err) => {
            console.error("Error updating channel:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal server error."
            }));
        });
}


async function deleteInChannelTable(req, res) {
    const channel_id = req.param.channelId;
    console.log(channel_id);
    const query = "DELETE FROM channel WHERE channel_id = ?";
   await connection.query(query, [channel_id])
        .then((results) => {
            if (results.affectedRows === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "Channel not found."
                }));
            }
            else {
                res.statusCode = 200;
                res.end(JSON.stringify({
                    status: "Success",
                    msg: "Channel deleted successfully."
                }));
            }

        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal Server Error"
            }));
        })
}


async function readChannelFromTable(req, res) {
    const tenant_id = req.body.tenant_id;
    if (!tenant_id) {
        res.statusCode = 400;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Tenant ID is required."
            }));
    }
    const query = "SELECT * FROM channel WHERE tenant_id = ?";
    await connection.query(query, [tenant_id])
    .then(([rows])=>{
        console.log(rows);
        if (rows.length === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "No channels found for the given tenant ID." 
            }));
        }
        else{
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "Success",
                data:rows
            }));
        }
       
    }) 
    .catch((err)=>{
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Success",
            msg:"Internal Server Error"
        }));
    })
}


async function readChannelFromTableById(req, res) {
    const channel_id = req.param.channelId;
    console.log(channel_id)
    if (!channel_id) {
        res.statusCode = 400;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "channel ID is required."
            }));
    }
    const query = "SELECT * FROM channel WHERE channel_id= ?";
    await connection.query(query, [channel_id])
    .then(([rows])=>{
        console.log(rows);
        if (rows.length === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "No channels found for the given tenant ID." 
            }));
        }
        else{
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "Success",
                data:rows
            }));
        }
       
    }) 
    .catch((err)=>{
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Success",
            msg:"Internal Server Error"
        }));
    })
}

async function createChannel(req, res) {
    try {
        let flag = verifyToken(req, res);
        if (flag) {
        flag = await findPermission(req, res, "create chaanel");
        if(flag)
        await insertIntoChannel(req, res);
        }
    } catch (error) {
        console.error("Error in createChannel:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function updateChannel(req, res) {
    try {
        let flag = verifyToken(req, res);
        if (flag) {
        flag = await findPermission(req, res, "create chaanel");
        if(flag)
        await updateInChannelTable(req, res);
        }
    } catch (error) {
        console.error("Error in updateChannel:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function deleteChannel(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if(flag){
          flag=  await findPermission(req, res, "create chaanel");
          if(flag)
            await deleteInChannelTable(req, res);
        }
      
    } catch (error) {
        console.error("Error in deleteChannel:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function readChannel(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if(flag){
           flag =  await findPermission(req, res, "create chaanel");
           if(flag)
            await readChannelFromTable(req, res);
        }
    } catch (error) {
        console.error("Error in readChannel:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function readChannelById(req, res) {
    try {
       let flag = await verifyToken(req, res);
       if(flag){
        flag = await findPermission(req, res, "create chaanel");
        if(flag)
        await readChannelFromTableById(req, res);
       }
        
    } catch (error) {
        console.error("Error in readChannelById:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}


module.exports = {
    readChannel,
    deleteChannel,
    updateChannel,
    createChannel,
    readChannelById
}