module.exports = function createProductDb(connection) {
    async function findMaxProductId(data, CustomError) {
        const query = "SELECT MAX(product_id) AS max_id FROM product";
        try {
            const rows = await connection.query(query);
            let maxProductId = 1;
            if (rows[0] && rows[0][0].max_id != null) {
                console.log(rows[0]);
                maxProductId = rows[0][0].max_id;
                console.log(maxProductId);
            }
            data.maxId = maxProductId;
            console.log(data.maxId);
        } catch (error) {
            console.log(error)
            throw new CustomError(404, 'Error in finding max product ID');
        }
    }
    
    async function insertInProductTable(data, CustomError) {
        const { tenant_id, image_url, price } = data;
    
        if (!price) {
            throw new CustomError(400, 'Price is a datauired field');
        }
    
        const query = "INSERT INTO product ( tenant_id, image_url, price) VALUES (?, ?, ?)";
    
        try {
            await connection.query(query, [tenant_id, image_url, price]);
            console.log('Inserted successfully in product table');
        } catch (error) {
            throw new CustomError(500, 'Error in inserting product');
        }
    }
    
    async function insertIntoProductTranslationTable(data, CustomError) {
        try{
            const product_id = data.param.productId?data.param.productId:data.maxId;
            const { tenant_id, product_name, product_type, product_url, product_description } = data;
            const query4 = 'SELECT product_id FROM product WHERE tenant_id = ? AND product_id = ?';
            await connection.query(query4,[tenant_id,product_id])
            .then(([rows])=>{
                   console.log(rows)
                if(rows.length===0){
                    throw new CustomError(404,"product Id is not found");
                }
            })
    
            let channel_code;
            if (data.param.channelCode) {
                channel_code = data.param.channelCode;
                const query = 'SELECT * FROM channel WHERE tenant_id = ? AND channel_code = ?';
                await connection.query(query,[tenant_id,channel_code])
                .then(([rows])=>{
                    console.log(rows);
                    if(rows.length == 0){
                        throw new CustomError(404,"this channel is not registered for the tenant");
                    }
    
                })
                .catch((err)=>{
                    throw err;
                })
            } else {
                channel_code = "en";
            }
        
            const query = "INSERT INTO product_translation (tenant_id, product_id, product_name, product_type, product_url, product_description, channel_code) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
            try {
                await connection.query(query, [tenant_id, product_id, product_name, product_type, product_url, product_description, channel_code]);
                console.log('Inserted successfully in product translation table');
            } catch (error) {
                console.log(error);
                throw error
            }
        }
        catch(err){
            throw err;
        }
      
    }

    //---------------------------UPDATE------------------------------------------------>
    async function updateInProductTable(data, CustomError) {
        const product_id = data.param.productId;
        const { image_url, price } = data;
    
        if (!product_id) {
            throw new CustomError(400, 'Product ID is datauired');
        }
    
        let setClause = "";
        let queryParams = [];
    
        if (image_url) {
            setClause += "image_url = ?, ";
            queryParams.push(image_url);
        }
        if (price) {
            setClause += "price = ?, ";
            queryParams.push(price);
        }
    
        if (setClause === "") {
            throw new CustomError(400, 'No fields to update.');
        }
    
        setClause = setClause.slice(0, -2);
        const query = `
            UPDATE product
            SET ${setClause}
            WHERE product_id = ?
        `;
    
        queryParams.push(product_id);
    
        try {
            const [rows, fields] = await connection.query(query, queryParams);
            if (rows.affectedRows === 0) {
                throw new CustomError(404, 'Product not found');
            }
            console.log('Updated in product');
        } catch (error) {
            throw new CustomError(500, 'Internal Server Error');
        }
    }
    
    
    async function updateInProductTranslationTable(data, CustomError) {
        const product_id = data.param.productId;
        let channel_code;
        if (data.param.channelCode) {
            channel_code = data.param.channelCode;
        } else {
            channel_code = "en";
        }
    
        const tenant_id = data.tenant_id;
    
        const { product_name, product_type, product_description } = data;
    
        if (!product_id) {
            throw new CustomError(404, 'Product ID is datauired');
        }
    
        let setClause = "";
        let queryParams = [];
    
        if (product_name) {
            setClause += "product_name = ?, ";
            queryParams.push(product_name);
        }
        if (product_type) {
            setClause += "product_type = ?, ";
            queryParams.push(product_type);
        }
        if (product_description) {
            setClause += "product_description = ?, ";
            queryParams.push(product_description);
        }
    
        if (setClause === "") {
            throw new CustomError(400, "No fields updated");
        }
    
        setClause = setClause.slice(0, -2);
        const query = `
            UPDATE product_translation
            SET ${setClause}
            WHERE product_id = ? AND tenant_id = ? AND channel_code = ?
        `;
    
        queryParams.push(product_id, tenant_id, channel_code);
    
        try {
            const [rows, fields] = await connection.query(query, queryParams);
            if (rows.affectedRows === 0) {
                throw new CustomError(404, 'Product translation not found');
            }
            console.log("Updated in product translation");
        } catch (error) {
            throw error
        }
    }
    //------------------------DELETE--------------------------------------------------------->
    async function deleteInProductTable(data, CustomError) {
        try{

            const product_id = data.param.productId;
            if (!product_id) {
                throw new CustomError(400, "Product ID is datauired");
            }
        
        
            const query = `SELECT product_id FROM product WHERE product_id = ?`
            await connection.query(query,[product_id])
            .then(([rows])=>{
             if(rows.length === 0)
                 throw new CustomError(400, "Product is not found");  
            })
        
        
        
        if(data.param.channelCode){
            try{
                console.log("here")
                const channel_code = data.param.channelCode;
                const query0  =  `SELECT * FROM product_translation WHERE product_id = ? and channel_code = ?`;
                await connection.query(query0,[product_id,channel_code])
                .then((rows)=>{
                    if(rows[0].length === 0)
                        throw new CustomError(404, "Product not found");
                })
                const query1 = "DELETE FROM product_translation WHERE product_id = ? AND channel_code = ?";
                const results1 = await connection.query(query1, [product_id,channel_code]);
                if (results1.affectedRows === 0) {
                    throw new CustomError(404, "Product not found");
                }
                else{
                    const query2 = `SELECT product_id FROM product_translation WHERE product_id = ?`
                    await connection.query(query2,[product_id])
                    .then(async (rows)=>{
                        console.log(rows[0])
                        if(rows[0].length===0){
                            const query3 = `DELETE FROM product WHERE product_id = ?`
                            await connection.query(query3,[product_id]);
                        }
                    })
                }
                console.log("Product deleted successfully");
            }
            catch(err){
                throw err;
            }
           
        }
        else{
            const query = "DELETE FROM product WHERE product_id = ?";
    
            try {
                const results = await connection.query(query, [product_id]);
                if (results.affectedRows === 0) {
                    throw new CustomError(404, "Product not found");
                }
        
                const query1 = "DELETE FROM product_translation WHERE product_id = ?";
                const results1 = await connection.query(query1, [product_id]);
                if (results1.affectedRows === 0) {
                    throw new CustomError(404, "Product translation not found");
                }
        
                console.log("Product deleted successfully");
            } catch (error) {
                throw error
            }
        }
    }
    catch(error){
        throw error;
    }
        
    }
    
    async function fetchAllProduct(data, CustomError) {
        const tenant_id = data.tenant_id;
        const query = `
            SELECT p.*, pt.product_name, pt.product_type, pt.product_description
            FROM product p
            LEFT JOIN product_translation pt ON p.product_id = pt.product_id
            WHERE p.tenant_id = ?
        `;
    
        try {
            const [results] = await connection.query(query, [tenant_id]);
            if (results.length === 0) {
                throw new CustomError(404, "No Product Found for the given tenant_id");
            }
            
            return results;
        } catch (error) {
            throw error;
        }
    }
    
    async function fetchProduct(data, CustomError) {
        const {tenant_id} = data;
        const product_id = data.param.productId;
        console.log("product_id", product_id);
        let channel_code;

        if (data.param.channelCode) {
            channel_code = data.param.channelCode;
            const query = 'SELECT * FROM channel WHERE tenant_id = ? AND channel_code = ?';
            await connection.query(query,[tenant_id,channel_code])
            .then(async ([rows])=>{
                console.log(rows);
                if(rows.length == 0){
                   channel_code = 'en'
                }
                else{
                    const query3 = 'SELECT * FROM product_translation WHERE product_id = ? AND channel_code = ?';
                    await connection.query(query3,[product_id,channel_code])
                    .then(([rows])=>{
                        console.log(rows);
                        if(rows.length == 0){
                           channel_code = 'en'
                        }
                    })
                }                

            })
            .catch((err)=>{
                throw err;
            })
        } else {
            channel_code = "en";
        }
        console.log(channel_code)
        const getProductQuery = `
            SELECT *
            FROM product
            WHERE product_id = ? AND tenant_id = ?
        `;
    
        try {
            const [productResults] = await connection.query(getProductQuery, [product_id,tenant_id]);
             console.log(productResults);
            if (productResults.length === 0) {
                throw new CustomError(404, "Product Not Found");
            }
    
            const getProductTranslationQuery = `
                SELECT *
                FROM product_translation
                WHERE product_id = ? AND channel_code = ?
            `;
            const [translationResults] = await connection.query(getProductTranslationQuery, [product_id,channel_code]);
    
            const responseData = {
                product: productResults[0],
                translations: translationResults[0]
            };
            console.log("res", responseData);
            return responseData;
           
        } catch (error) {
            throw error
        }
    }
    
//---------------------------------------------------------------------------------------------------------->
    
    return {
        findMaxProductId,
        insertIntoProductTranslationTable,
        insertInProductTable,
        updateInProductTable,
        updateInProductTranslationTable,
        deleteInProductTable,
        fetchAllProduct,
        fetchProduct    
    }
}


