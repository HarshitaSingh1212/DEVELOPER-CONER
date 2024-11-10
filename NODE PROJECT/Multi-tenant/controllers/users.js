const connection = require("../utilities/database");
const { verifyToken } = require("../middleware/token");
const findPermission = require("../middleware/find-permission");

async function updateEmployeeFields(req, res) {
    const employee_Id = req.param.employeeId;
    const {employee_status, employee_name, employee_permission } = req.body;
    const values = [];
    let query = `UPDATE employees SET `;
 
    if (employee_name) {
        query += `employee_name = ?, `;
        values.push(employee_name);
    }
    if (employee_status) {
        query += `employee_status = ?, `;
        values.push(employee_status);
    }
    
    if (employee_permission) {
        query += `employee_permission = ?, `;
        values.push(JSON.stringify(employee_permission));
    }
    
    query = query.slice(0, -2);
    
    
    query += ` WHERE employee_Id = ?`;
    values.push(employee_Id);

    try {
        await connection.query(query, values);
         res.statusCode =200;
         res.end(JSON.stringify({
            status:"Success",
            msg:'Employee fields updated successfully'
         }))
    } catch (error) {
        console.error('Error updating employee fields:', error);
        res.statusCode =500;
        res.end(JSON.stringify({
            status:"Failed",
            msg:'Internal Server Error'
         }))
    }
}


async function deleteEmployeeInEmployees(req, res) {
    const employee_Id = req.param.employeeId;

    const query = `DELETE FROM employees WHERE employee_Id = ?`;

    try {
        await connection.query(query, [tenant_id, employee_email]);
        res.statusCode =200;
         res.end(JSON.stringify({
            status:"Success",
            msg:'Employee deleted successfully'
         }))

    } catch (error) {
        console.error('Error deleting employee:', error);
        res.statusCode =500;
        res.end(JSON.stringify({
            status:"Failed",
            msg:'Internal Server Error'
         }))
    }
}


async function deleteUser(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if(flag){
            flag = await findPermission(req, res, "delete user");
            if(flag)
            await deleteEmployeeInEmployees(req, res);
        }
       
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function updateUser(req, res) {
    try {
      let flag =  await verifyToken(req, res);
      if(flag){
        await findPermission(req, res, "update user");
        if(flag)
        await updateEmployeeFields(req, res);
      }
        
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}



module.exports = {
    deleteUser,
    updateUser
}
   
