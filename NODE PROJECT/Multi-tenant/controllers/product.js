const { verifyToken } = require("../middleware/token");
const connection = require("../utilities/database.js");
const findPermission = require("../middleware/find-permission");

//------------------------------CREATE PRODUCT---------------------------------->

async function findMaxProductId(req, res) {
    const query = "SELECT MAX(product_id) AS max_id FROM product";
    await connection.query(query)
        .then((rows) => {
            let maxProductId = 1;
            if (rows[0]&&rows[0][0].max_id!=null) {
                console.log(rows[0])
                maxProductId = rows[0][0].max_id;
                console.log(maxProductId);
            }
            req.body.maxId = maxProductId;
            console.log(req.body.maxId);

        })
        .catch((err) => {
            res.statusCode = 400;
            res.end(JSON.stringify({
                status:"Failed",
                msg:"Error In FInding Max"
            }))

        })
}

async function generateUrl(req) {

    let product = {
        id: req.body.maxId,
        name: req.body.product_name,
        channelCode: req.param.channelCode
    };
    let baseUrl;
    if (req.params && req.params.channelCode)
        baseUrl = `http://localhost:5000/product/${product.name}/${product.id}/${product.channelCode}`;
    else {
        baseUrl = `http://localhost:5000/product/${product.name}/${product.id}/en`;
    }

    req.body.product_url = baseUrl;
}

async function insertInProductTable(req, res) {
    const { tenant_id, image_url, price, } = req.body;

    if (!price) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status:"Failed",
            msg:"Price is required field"
        }))
    }
    const query = "INSERT INTO product ( tenant_id, image_url, price) VALUES (?, ?, ?)";

    await connection.query(query, [tenant_id, image_url, price])
        .then((rows) => {

            console.log("inserted successfully in product table");
        })
        .catch((err) => {
            res.statusCode = 400;
            res.end(JSON.stringify({
                status:"Failed",
                msg:"Error In Inserting Product"
            }))
        })
}

async function insertIntoProductTranslationTable(req, res) {
    const product_id = req.body.maxId;
    let channel_code;
    if (req.param.channelCode)
        channel_code = req.param.channelCode;
    else
        channel_code = "en";
    const { tenant_id, product_name, product_type, product_url, product_description, price } = req.body;

    if (!price) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status:"Failed",
            msg:"Price is required field"
        }))
    }
    const query = "INSERT INTO product_translation (tenant_id,product_id,product_name,product_type,product_url, product_description, channel_code) VALUES (?, ?, ?,?,?,?,?)";

    await connection.query(query, [tenant_id, product_id, product_name, product_type, product_url, product_description, channel_code])
        .then(([rows, fields]) => {
            res.end("success")
        })
        .catch((err) => {
            console.log(err)
            res.statusCode = 400;
            res.end(JSON.stringify({
                status:"Failed",
                msg:"Error In Inserting Product"
            }))
        })
}

//-------------------------------UPDATE PRODUCT------------------------------------->

async function updateInProductTable(req, res) {
    const product_id = req.param.productId;
    const { image_url, price } = req.body;

    if (!product_id) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "Failed",
            msg: "Product ID is required"
        }))
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
        return res.status(400).json({ error: "No fields to update." });
    }
    setClause = setClause.slice(0, -2);
    const query = `
        UPDATE product
        SET ${setClause}
        WHERE product_id = ?
    `;

    queryParams.push(product_id);

    await connection.query(query, queryParams)
        .then(([rows, fields]) => {
            if (rows.affectedRows === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "Product not found"
                }))
            }
            console.log("upadeted in product")
        })
        .catch((error) => {
            console.error("Error updating product:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal Server Error"
            }))
        });
}


async function updateInProductTranslationTable(req, res) {
    const product_id = req.param.productId;
    let channel_code;
    if (req.param.channelCode) {
        channel_code = req.param.channelCode;
    }
    else
        channel_code = "en";

    let product_url
    tenant_id = req.body.tenant_id;
    if (req.body.product_name) {
        product_url = `http://localhost:5000/product/${req.body.product_name}/${req.param.productId}/${channel_code}`
    }
    const { product_name, product_type, product_description } = req.body;

    if (!product_id) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "Failed",
            msg: "Product ID is required"
        }))

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
    if (product_url) {
        setClause += "product_url = ?, ";
        queryParams.push(product_url);
    }
    if (product_description) {
        setClause += "product_description = ?, ";
        queryParams.push(product_description);
    }

    if (setClause === "") {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "Failed",
            msg: "No Fields Updated"
        }))

    }
    setClause = setClause.slice(0, -2);
    const query = `
        UPDATE product_translation
        SET ${setClause}
        WHERE product_id = ? AND tenant_id = ? AND channel_code = ?
    `;

    queryParams.push(product_id, tenant_id, channel_code);

    await connection.query(query, queryParams)
        .then(([rows, fields]) => {
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "Success",
                msg: "Product Updated Successfully"
            }))

        })
        .catch((error) => {
            console.error("Error updating product translation:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal Server Error"
            }))
        });
}

//----------------------------------DELETE PRODUCT---------------------------->

async function deleteInProductTABLE(req, res) {

    const productId = req.param.productId;

    if (!productId) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            status: "Failed",
            msg: "Product ID is required"
        }))
    }
    

    const query = "DELETE FROM product WHERE product_id = ?";

   await connection.query(query, [productId])
    .then((results)=>{
        if (results.affectedRows === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Product not found"
            }))
        }
       })
    .catch((err)=>{
            console.error("Error deleting product:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal Server"
            }))
        })



    const query1 = "DELETE FROM product_translation WHERE product_id = ?";

    connection.query(query1, [productId])
        .then((results) => {
            if (results.affectedRows === 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "Product not found"
                }))
            }

            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "Success",
                msg: "Product deleted successfully"
            }))

        })
        .catch(err => {
            console.error("Error deleting product translation:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal Server Error"
            }))
        });
}
//---------------------------READ PRODUCT------------------------------------>

async function fetchAllProduct(req, res) {
    const tenant_id = req.body.tenant_id;
    const query = `
        SELECT p.*, pt.product_name, pt.product_type, pt.product_description
        FROM product p
        LEFT JOIN product_translation pt ON p.product_id = pt.product_id
        WHERE p.tenant_id = ?
    `;

    await connection.query(query, [tenant_id])
        .then(([results]) => {
            if (results.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "No Product Found for the given tenant_id"
                }));
            }
            else{
                res.statusCode = 200;
                res.end(JSON.stringify({
                    status: "Success",
                    data: results
                }));
            }
          
        })
        .catch((err)=>{
            console.error("Error fetching products:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "Failed",
                msg: "Internal Server Error"
            }))
        })


}


async function fetchProduct(req, res) {
    const productId = req.param.productId;

    const getProductQuery = `
                SELECT *
                FROM product
                WHERE product_id = ?
            `;

    await connection.query(getProductQuery, [productId])
        .then(([productResults]) => {

            if (productResults.length === 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "Product Not Found"
                }))
            }

            if (!req.param.channelCode) {
                req.parsedUrl = `${req.parsedUrl}/en`
            }
            const getProductTranslationQuery = `
                    SELECT *
                    FROM product_translation
                    WHERE product_url = ?
                `;

            connection.query(getProductTranslationQuery, [req.parsedUrl])
                .then(([translationResults]) => {

                    const responseData = {
                        product: productResults[0],
                        translations: translationResults[0]
                    };

                    res.statusCode = 200;
                    res.end(JSON.stringify({
                        status: "Success",
                        data: responseData
                    }))
                })
                .catch((err) => {
                    if (err) {
                        console.error("Error retrieving product translation data:", err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({
                            status: "Failed",
                            msg: "Internal Server Error"
                        }))
                    }
                })
        })
        .catch((err => {
            if (err) {
                console.error("Error retrieving product data:", err);
                res.statusCode = 500;
                res.end(JSON.stringify({
                    status: "Failed",
                    msg: "Internal Server Error"
                }))
            }

        }))
}



//---------------------------------------------------------------------->

async function createProduct(req, res) {
    try {
        if (req.body.image_url) {
            req.body.image_url = JSON.stringify(req.body.image_url);
        }
       let flag =  await verifyToken(req, res);
       if(flag){
        flag = await findPermission(req, res, "create product");
        if(flag){
            await findMaxProductId(req, res);
            await generateUrl(req, res);
            await insertInProductTable(req, res);
            await insertIntoProductTranslationTable(req, res);
        }
       
       }
      
    } catch (error) {
        console.error("Error in createProduct:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function updateProduct(req, res) {
    try {
        if (req.body.image_url) {
            req.body.image_url = JSON.stringify(req.body.image_url);
        }
        let flag = await verifyToken(req, res);
        if(flag){
            flag =await findPermission(req, res, "update product");
            if(flag){
                await updateInProductTable(req, res);
                await updateInProductTranslationTable(req, res);
            }
        }
        
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function deleteProduct(req, res) {
    try {
       let flag =  await verifyToken(req, res);
       if(flag){
        flag = await findPermission(req, res, "update product");
        if(flag)
        await deleteInProductTABLE(req, res);
       }   
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function readAllProduct(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if(flag){
          flag =   await findPermission(req, res, "read product");
          if(flag)
            await fetchAllProduct(req, res);
        }
    } catch (error) {
        console.error("Error in readAllProduct:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function readProduct(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if(flag){
           flag =  await findPermission(req, res, "read product");
           if(flag)
            await fetchProduct(req, res);
        }
       
    } catch (error) {
        console.error("Error in readProduct:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    readAllProduct,
    readProduct
}

