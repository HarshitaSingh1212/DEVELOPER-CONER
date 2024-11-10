module.exports = function createChannelDb(connection) {
    async function insertIntoChannelTable(data, CustomError) {
        const { tenant_id } = data;
        const query = "INSERT INTO channel (tenant_id, channel_code, channel_name) VALUES (?, ?, ?)";
        try {
            await connection.query(query, [tenant_id, "en", "english"]);
            console.log('Data inserted successfully into channel');
        } catch (error) {
            throw error
        }
    }

    async function insertIntoChannel(data, CustomError) {
        const { tenant_id, channel_code, channel_name } = data;
        if (!tenant_id || !channel_code || !channel_name) {
            throw new CustomError(400, "Tenant ID, channel code, and channel name are datauired fields.");
        } else {
            const query = "INSERT INTO channel (tenant_id, channel_code, channel_name) VALUES (?, ?, ?)";
            try {
                await connection.query(query, [tenant_id, channel_code, channel_name]);
            } catch (err) {
                console.error("Error inserting channel:", err);
                throw err
            }
        }
    }

    async function updateInChannelTable(data, CustomError) {
        const channel_id = data.param.channelId;
        const { tenant_id, channel_code, channel_name } = data;

        if (!channel_id || (!channel_code && !channel_name)) {
            throw new CustomError(400, "Channel ID and either channel code or channel name are datauired fields for update.");
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
            throw new CustomError(400, "No Fields to update");
        }

        setClause = setClause.slice(0, -2);

        const query = `
            UPDATE channel
            SET ${setClause}
            WHERE tenant_id = ? AND channel_id = ? AND channel_code != ?
        `;

        queryParams.push(tenant_id, channel_id,'en');

        try {
            const [results] = await connection.query(query, queryParams);
            if (results.affectedRows === 0) {
                throw new CustomError(400, "Channel not found or you are trying to update channel_code = en");
            }
        } catch (err) {
            throw err
        }
    }

    async function deleteInChannelTable(data, CustomError) {
        const channel_id = data.param.channelId;
        if (!channel_id) {
            throw new CustomError(404, "Channel ID is datauired.");
        }
        const query = "DELETE FROM channel WHERE channel_id = ? AND channel_code != ?";
        try {
            const [results] = await connection.query(query, [channel_id,'en']);
            if (results.affectedRows === 0) {
                throw new CustomError(404, "Either Channel is not found or channel_code = en can not be deleted");
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async function readChannelFromTable(data, CustomError) {
        const tenant_id = data.tenant_id;
        if (!tenant_id) {
            throw new CustomError(404, "Tenant ID is datauired.");
        }
        const query = "SELECT * FROM channel WHERE tenant_id = ?";
        try {
            const [rows] = await connection.query(query, [tenant_id]);
            if (rows.length === 0) {
                throw new CustomError(404, "No channels found for the given tenant ID.");
            }
            return rows;
        } catch (err) {
            throw err
        }
    }

    async function readChannelFromTableById(data, CustomError) {
        const {tenant_id} = data;
        const channel_id = data.param.channelId;
        console.log(channel_id);
        if (!channel_id) {
            throw new CustomError(404, "Channel ID is datauired.");
        }
        const query = "SELECT * FROM channel WHERE channel_id= ? AND tenant_id = ?";
        try {
            const [rows] = await connection.query(query, [channel_id,tenant_id]);
            if (rows.length === 0) {
                throw new CustomError(404, "No channels found for the given channel ID.");
            }
            return rows;
        } catch (err) {
            throw err
        }
    }

    return {
        insertIntoChannelTable,
        insertIntoChannel,
        updateInChannelTable,
        deleteInChannelTable,
        readChannelFromTable,
        readChannelFromTableById
    }
}