const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { converter,converterTitleValues }= require ("../sql/queryHandler"); 
const moment = require('moment'); // require
const sql = require('mssql')

let pool;
const sqlConfig = {
  user: `${process.env.MS_USERNAME}`,
  password: `${process.env.MS_PASSWORD}`,
  database: `${process.env.MS_DATABASE}`,
  server: `${process.env.MS_SERVER}`,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
const connectToSQL = async () => {
  try {
   pool = await sql.connect(sqlConfig)
   console.log(`connected to MSsql1232`)
} catch (err) {
   console.log(err)
  }
 }
 connectToSQL()
const {adjustingParameter}= require("./../sql/try")

exports.insertApartmentMSSQL=async(req,res)=>{
    let user_id=req.url.split('/')[4]
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    try {        
    form.parse(req,async (err, fields, files)=>{
        const data=JSON.parse(fields.json)
         const parsObj={...data.fullForm,
            price:parseFloat(data.fullForm.price),
            property_address_num:parseFloat(data.fullForm.property_address_num),
            property_floor:parseFloat(data.fullForm.property_floor),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            num_of_rooms:parseFloat(data.fullForm.num_of_rooms),
            num_of_parking:parseFloat(data.fullForm.num_of_parking),
            num_of_balcony:parseFloat(data.fullForm.num_of_balcony),
            build_mr:parseFloat(data.fullForm.build_mr),
            build_mr_total:parseFloat(data.fullForm.build_mr_total),
            entry_date :moment(data.fullForm.entry_date).format('YYYY-MM-DD')
        }
        let prod={...parsObj,...data.redioButtons,...data.pics,_id:user_id,Route_name:'basic',updatedAt:new Date(),createdAt:new Date()}
        delete prod.name
        delete prod.categories
        delete prod.category
        delete prod.shipping
        delete prod.loading
        delete prod.error
        delete prod.createdProduct
        delete prod.redirectToProfile
        delete prod.formData
        delete prod.quantity
        delete prod.photo
        delete prod.Route
        const {
            description,
            price,
            property_type,
            property_condition,
            property_address_city,
            property_address_street,
            property_address_num,
            property_floor,
            property_total_floors,
            num_of_rooms,
            is_on_pillars,
            num_of_parking,
            num_of_balcony,
            build_mr,
            build_mr_total,
            contact_name,
            contact_number_start,
            contact_number,
            mail,
            Route_name,
            entry_date,
            air_condition,
            shelter,
            garage,
            pandor,
            furniture,
            handicapped,
            elevator,
            tadiran,
            unit,
            renovated,
            kosher,
            boiler,
            bars,
            pic1,
            pic2,
            pic3,
            pic4,
            pic5,
            pic6,
            updatedAt,
            createdAt,
        }=prod
       console.log(prod,'prod')
             await pool.request()
            .input('_id', sql.NVarChar, Math.random().toString(36).substring(2, 15))
            .input('description', sql.NVarChar, description)
            .input('price', sql.Int, price)
            .input('property_type', sql.NVarChar, property_type)
            .input('property_condition', sql.NVarChar, property_condition)
            .input('property_address_city', sql.NVarChar, property_address_city)
            .input('property_address_street', sql.NVarChar, property_address_street)
            .input('property_address_num', sql.Int, property_address_num)
            .input('property_floor', sql.Int, property_floor)
            .input('property_total_floors', sql.Int, property_total_floors)
            .input('num_of_rooms', sql.Int, num_of_rooms)
            .input('is_on_pillars', sql.Bit, is_on_pillars)
            .input('num_of_parking', sql.Int, num_of_parking)
            .input('num_of_balcony', sql.Int, num_of_balcony)
            .input('build_mr', sql.Int, build_mr)
            .input('build_mr_total', sql.Int, build_mr_total)
            .input('contact_name', sql.NVarChar, contact_name)
            .input('contact_number_start', sql.NVarChar, contact_number_start)
            .input('contact_number', sql.NVarChar, contact_number)
            .input('mail', sql.NVarChar, mail)
            .input('Route_name', sql.NVarChar, Route_name)
            .input('entry_date', sql.Date, entry_date)
            .input('air_condition', sql.Bit, air_condition)
            .input('shelter', sql.Bit, shelter)
            .input('garage', sql.Bit, garage)
            .input('pandor', sql.Bit, pandor)
            .input('furniture', sql.Bit, furniture)
            .input('handicapped', sql.Bit, handicapped)
            .input('elevator', sql.Bit, elevator)
            .input('tadiran', sql.Bit, tadiran)
            .input('unit', sql.Bit, unit)
            .input('renovated', sql.Bit, renovated)
            .input('kosher', sql.Bit, kosher)
            .input('boiler', sql.Bit, boiler)
            .input('bars', sql.Bit, bars)
            .input('pic1', sql.NVarChar, pic1)
            .input('pic2', sql.NVarChar, pic2)
            .input('pic3', sql.NVarChar, pic3)
            .input('pic4', sql.NVarChar, pic4)
            .input('pic5', sql.NVarChar, pic5)
            .input('pic6', sql.NVarChar, pic6)
            .input('userId', sql.NVarChar, user_id)
            .input('updatedAt', sql.Date, updatedAt)
            .input('createdAt', sql.Date, createdAt)
            // .output('output_parameter', sql.VarChar(50))
            .execute('sp_insert_apartment') 
    })
    }
    catch (error) {
     res.status(400).send(error)   
    }
    res.status(200).send({msg:'success'})
        return
} 


exports.deleteFomMSSQL=async(req,res)=>{
    try {
      const apartment_id=req.url.split('/')[4]
      const result = await sql.query`DELETE FROM apartments WHERE _id=${apartment_id};`
      res.send(result.rowsAffected)
    //   res.status(200).send('ok')
    return 
    } catch (error) {
    //    res.send(err)
    res.status(400).send(error)
    }        
   }

exports.listMSSQL=async(req,res)=>{
 try {
   const result = await sql.query`select * from apartments`
   res.send(result.recordset)
 return 
 } catch (error) {
    res.send(err)
 }        
}
exports.listByUserMSSQL=async(req,res)=>{
    const user_id=req.url.split('/')[5]
    console.log(user_id)
    try {
        const result = await sql.query`select * from apartments Where userId = ${user_id}`
        res.send(result.recordset)
        return     
    } catch (error) {
        res.send(err)    
    }
}
exports.getSingleApartmentMSSQL=async(req,res)=>{
    const apartment_id=req.url.split('/')[4]
    console.log(apartment_id)
    try {
        const result = await sql.query`select * from apartments Where _id = ${apartment_id}`
        res.send(result.recordset)
        return     
    } catch (error) {
        res.send(err)    
    }
}

exports.searchMSSQL=async(req,res)=>{
    console.log(req.body)
    res.send({msg:'success'})
}

exports.listBySearchSQL =async(req, res) => {
    try {
        const result=await sql.query("SELECT top 2 * from apartments")  
        console.log(result.rowsAffected)
        res.status(200).send({
            size:result.rowsAffected,
            data:result.recordsets
})      
    } catch (error) {
        console.log(error)
        res.send(error)
    }
};
exports.createSQLProcedure= (req, res) => {
    let values;
    let user_id=req.url.split('/')[4]
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
        const data=JSON.parse(fields.json)
         const parsObj={...data.fullForm,
            price:parseFloat(data.fullForm.price),
            property_address_num:parseFloat(data.fullForm.property_address_num),
            property_floor:parseFloat(data.fullForm.property_floor),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            num_of_rooms:parseFloat(data.fullForm.num_of_rooms),
            num_of_parking:parseFloat(data.fullForm.num_of_parking),
            num_of_balcony:parseFloat(data.fullForm.num_of_balcony),
            build_mr:parseFloat(data.fullForm.build_mr),
            build_mr_total:parseFloat(data.fullForm.build_mr_total),
            entry_date :moment(data.fullForm.entry_date).format('YYYY-MM-DD')
        }
        let prod={...parsObj,...data.redioButtons,...data.pics,userid:user_id}
        delete prod.name
        delete prod.categories
        delete prod.category
        delete prod.shipping
        delete prod.loading
        delete prod.error
        delete prod.createdProduct
        delete prod.redirectToProfile
        delete prod.formData
        delete prod.quantity
        delete prod.photo
        delete prod.Route
        converter(prod).then(res=>{
            values=res
            const arr=values.split(',')
            arr.length=39
            client.query(
                        `CALL genre_insert_data(${adjustingParameter(arr)})`,
                        (err, res) => {
                          console.log(err, res);
                        }
                      );
        })
    })
    res.status(200).send('success')
};
exports.createSQL = (req, res) => {
    let titles,values;
    let user_id=req.url.split('/')[4]
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
        const data=JSON.parse(fields.json)
         const parsObj={...data.fullForm,
            price:parseFloat(data.fullForm.price),
            property_address_num:parseFloat(data.fullForm.property_address_num),
            property_floor:parseFloat(data.fullForm.property_floor),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            num_of_rooms:parseFloat(data.fullForm.num_of_rooms),
            num_of_parking:parseFloat(data.fullForm.num_of_parking),
            num_of_balcony:parseFloat(data.fullForm.num_of_balcony),
            build_mr:parseFloat(data.fullForm.build_mr),
            build_mr_total:parseFloat(data.fullForm.build_mr_total),
            entry_date :moment(data.fullForm.entry_date).format('YYYY-MM-DD')
        }
        let prod={...parsObj,...data.redioButtons,...data.pics,userid:user_id}
        delete prod.name
        delete prod.categories
        delete prod.category
        delete prod.shipping
        delete prod.loading
        delete prod.error
        delete prod.createdProduct
        delete prod.redirectToProfile
        delete prod.formData
        delete prod.quantity
        delete prod.photo
        delete prod.Route
        console.log(prod,'prodprodprodprodprod')
        converterTitleValues(prod).then(res=>{
            titles=res
            console.log(titles,'titles')
        })
        converter(prod).then(res=>{
            values=res
            console.log(values
                ,'values!')})
                .finally(()=>{
                    client.query(
                        `INSERT INTO products(${titles})VALUES(${values})`,
                        (err, res) => {
                          
                          console.log(err, res);
                        //   client.end();
                        }
                      );
                 })
                 res.status(200).send('success')
    })
};
exports.productById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: "Product not found"
                });
            }
            req.product = product;
            next();
        });
};

exports.listByUser = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};
exports.singleProduct = (req, res) => {
console.log(req.body.productId)
Product.find({_id:req.body.productId}).then(items => {
    return res.json(items);
  })
};
exports.singleProductSQL =async (req, res) => {
    console.log(req.body.productId)
    try {
        const result=await client.query(`SELECT * from products 
        WHERE _id = '${req.body.productId}'`)  
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
    };

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    let userId=req.url.split('/')[3]
    console.log(userId)
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
        const data=JSON.parse(fields.json)
        const parsObj={...data.fullForm,
            price:parseFloat(data.fullForm.price),
            property_address_num:parseFloat(data.fullForm.property_address_num),
            property_floor:parseFloat(data.fullForm.property_floor),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            property_total_floors:parseFloat(data.fullForm.property_total_floors),
            num_of_rooms:parseFloat(data.fullForm.num_of_rooms),
            num_of_parking:parseFloat(data.fullForm.num_of_parking),
            num_of_balcony:parseFloat(data.fullForm.num_of_balcony),
            build_mr:parseFloat(data.fullForm.build_mr),
            build_mr_total:parseFloat(data.fullForm.build_mr_total),
        }
        console.log('data',data)
        let prod={...parsObj,...data.redioButtons,...data.pics,userId}
        let product = new Product(prod)
        product.save((err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    console.log(result)
      res.json(result);

                });
    })
    //  product.aggregate([
    //     {
    //       $addFields: {
    //         rooms: {
    //           $toDouble: "$num_of_rooms"
    //         }
    //       }
    //     }
    //   ])

    // res.json(req.body);
    

    //     // 1kb = 1000
    //     // 1mb = 1000000

    //     if (files.photo) {
    //         // console.log("FILES PHOTO: ", files.photo);
    //         if (files.photo.size > 1000000) {
    //             return res.status(400).json({
    //                 error: "Image should be less than 1mb in size"
    //             });
    //         }
    //         product.photo.data = fs.readFileSync(files.photo.path);
    //         product.photo.contentType = files.photo.type;
    //     }

    //     product.save((err, result) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: errorHandler(err)
    //             });
    //         }
    //         res.json(result);
    //     });
    // });
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product deleted successfully"
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};


exports.listOfProductsByUser=(req,res)=>{
    let userId=req.url.split('/')[4]
    Product.find({userId})
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        });
}

exports.listOfProductsByUserSQL =async(req, res) => {
    let userId=req.url.split('/')[5]
    try {
        const result=await client.query(`SELECT * from products 
        WHERE userid = '${userId}'`)  
        res.json(result.rows);      
    } catch (error) {
        console.log(error)
        res.send(error)
    }
};


exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        });
};


exports.updateOne = (req, res) => {
    Product.update({'_id':req.body.product._id},{$set:{...req.body.product}})
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Products not found"
            });
        }
        return res.status(200).json({
            msg: "המודעה עודכנה בהצלחה"
        });
    })
};

exports.updateOneSQL = (req, res) => {
    let titles,values;
    let obj=req.body.product;
    const parsObj={...obj,
        price:parseFloat(obj.price),
        property_address_num:parseFloat(obj.property_address_num),
        property_floor:parseFloat(obj.property_floor),
        property_total_floors:parseFloat(obj.property_total_floors),
        property_total_floors:parseFloat(obj.property_total_floors),
        num_of_rooms:parseFloat(obj.num_of_rooms),
        num_of_parking:parseFloat(obj.num_of_parking),
        num_of_balcony:parseFloat(obj.num_of_balcony),
        build_mr:parseFloat(obj.build_mr),
        build_mr_total:parseFloat(obj.build_mr_total),
        entry_date :moment(obj.entry_date).format('YYYY-MM-DD')
    }
    converterTitleValues(parsObj).then(res=>{
        titles=res.split(', ')
    })
    converter(parsObj).then(res=>{
        values=res.split(',')
    })
            .finally(()=>{
        let query='UPDATE products SET ';
                for(let i=0;i<titles.length;i++)
                {
                    query=query+`${titles[i]} = ${values[i]}, `
                }
                query = query.slice(0, -2); 
                query = query+` WHERE _id = ${parsObj._id}`
                console.log(query,'queryquery')
                client.query(
                    query,
                    (err, res) => {
                        if(err){
                            return res.status(400).json({
                                msg: "עדכון המודעה נכשל"
                            });    
                        }
                      console.log(err, res);
                    }
                  );
             })
        return res.status(200).json({
            msg: "המודעה עודכנה בהצלחה"
        });
};

exports.deleteOne = (req, res) => {
    Product.deleteOne( {'_id':req.body.product._id} )
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Products not found"
            });
        }
        return res.status(200).json({
            msg: "המודעה נמחקה"
        });
    })
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 exports.listBySearch = (req, res) => {
    Product.find({})
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data,
            });
        });
};
// exports.listByFilterNoSort=async(req,res)=>{
//     let {num,filters,sortMethod}=req.body
//     console.log(num,filters,sortMethod,'num,filters,sortMethod')
//     if(num<4)
//     num=4
//     let fullLength=4
//     console.log(sortMethod,'sortMethod')
//     console.log(filters,'filters')
//     if(!filters)
//     filters={}

//     await Product.find(filters).count({}, function(error, numOfDocs) {
//         console.log('I have '+numOfDocs+' documents in my collection');
//         fullLength=numOfDocs
//     })
//     if(sortMethod==='priceHighToLow')
//     {
//         Product.find(filters).count({}, function(error, numOfDocs) {
//             console.log('I have '+numOfDocs+' documents in my collection');
//             fullLength=numOfDocs
//         });
//         Product.find(filters).limit(num).sort( { price: -1 } )
//         .exec((err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: "Products not found"
//                 });
//             }
//             res.json({
//                 size: data.length,
//                 data,
//                 FiltersAfterSearch:filters,
//                 num:num+1,
//                 sortMethod:'priceHighToLow',
//                 fullLength
//             });
//         });
//         return
//     }
//     if(sortMethod==='priceLowToHigh')
//     {
//         Product.find(filters).limit(num).sort( { price: 1 } )
//         .exec((err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: "Products not found"
//                 });
//             }
//             res.json({
//                 size: data.length,
//                 data,
//                 FiltersAfterSearch:filters,
//                 num:num+1,
//                 sortMethod:'priceLowToHigh',
//                 fullLength
//             });
//         });
//         return
//     }
//     Product.find(filters).limit(num)
//     .exec((err, data) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "Products not found"
//             });
//         }
//         res.json({
//             size: data.length,
//             data,
//             FiltersAfterSearch:filters,
//             num:num+1,
//             fullLength
//         });
//     });
// }

// 
// exports.listByFilterNoSortSQL=async(req,res)=>{
//     let {num,filters,sortMethod}=req.body
//     if(num<4)
//     num=4
//     let fullLength=4
//     console.log(sortMethod,'sortMethod')
//     console.log(filters,'filters')
//     if(typeof(filters)!='string')
//     filters=('')
//     const answer=await client.query(filters)
//     fullLength=answer.rowCount 
//     if(sortMethod==='priceHighToLow')
//     {
//         try {
//             const answerWithSort=await client.query(filters+` ORDER BY price DESC LIMIT ${num}`)
//             res.json({
//                 size: answerWithSort.rowCount,
//                 data:answerWithSort.rows,
//                 FiltersAfterSearch:filters,
//                 num:num+1,
//                 sortMethod:'priceHighToLow',
//                 fullLength
//             });            
//         } catch (error) {
//             return res.status(400).json({
//                             error: "Products not found"
//                         });
//         }
//         return
//     }
//     if(sortMethod==='priceLowToHigh')
//     {
//         try {
//             const answerWithSort=await client.query(filters+` ORDER BY price LIMIT ${num}`)
//             res.json({
//                 size: answerWithSort.rowCount,
//                 data:answerWithSort.rows,
//                 FiltersAfterSearch:filters,
//                 num:num+1,
//                 sortMethod:'priceLowToHigh',
//                 fullLength
//             });            
//         } catch (error) {
//             return res.status(400).json({
//                             error: "Products not found"
//                         });
//         }
//         return
//     }
//     try {
//             const answerWithSort=await client.query(filters+` LIMIT ${num}`)
//             res.json({
//                 size: answerWithSort.rowCount,
//                 data:answerWithSort.rows,
//                 FiltersAfterSearch:filters,
//                 num:num+1,
//                 sortMethod:'',
//                 fullLength
//             });            
//         } catch (error) {
//             return res.status(400).json({
//                             error: "Products not found"
//                         });
//         }
//         return
// }

// 

exports.listByFilter = (req, res) => {
    console.log(req.body)
let filters={}
let endFilters={}
let booleanFilters={}
for(key in req.body){
                    if ( req.body[key] === true) {
                booleanFilters={...booleanFilters,[key]:(req.body[key]) }
                endFilters={...endFilters,[key]: {$eq: true}}
            }

        if(req.body[key]!==null&&req.body[key]!==undefined&&req.body[key]!==NaN&&req.body[key].length>0&&req.body[key]!==false)
        {
                filters={...filters,[key]:parseFloat(req.body[key]) }
            }   
             }
    if ('min_num_of_rooms' in filters   )
    {
        endFilters={...endFilters,num_of_rooms: { $gte: filters.min_num_of_rooms }}
    }
    if ('max_num_of_rooms' in filters   )
    {
        endFilters={...endFilters,num_of_rooms: { $lte: filters.max_num_of_rooms }}
    }
    if ('max_num_of_rooms' in filters && 'min_num_of_rooms' in filters )
    {
        endFilters={...endFilters,num_of_rooms: { $lte: filters.max_num_of_rooms,$gte: filters. min_num_of_rooms }}
    }
    if ('min_price' in filters   )
    {
        endFilters={...endFilters,price: { $gte: filters.min_price }}
    }
    if ('max_price' in filters   )
    {
        endFilters={...endFilters,price: { $lte: filters.max_price }}
    }
    if ('max_price' in filters && 'min_price' in filters )
    {
        endFilters={...endFilters,price: { $lte: filters.max_price,$gte: filters.min_price }}
    } 
    if ('min_num_of_floors' in filters   )
    {
        endFilters={...endFilters,property_floor: { $gte: filters.min_num_of_floors }}
    }
    if ('max_num_of_floors' in filters   )
    {
        endFilters={...endFilters,property_floor: { $lte: filters.max_num_of_floors }}
    }
    if ('max_num_of_floors' in filters && 'min_num_of_floors' in filters )
    {
        endFilters={...endFilters,property_floor: { $lte: filters.max_num_of_floors,$gte: filters.min_num_of_floors }}
    } 
    if ('min_mr' in filters   )
    {
        endFilters={...endFilters,build_mr_total: { $gte: filters.min_mr }}
    }
    if ('max_mr' in filters   )
    {
        endFilters={...endFilters,build_mr_total: { $lte: filters.max_mr }}
    }
    if ('max_mr' in filters && 'min_mr' in filters )
    {
        endFilters={...endFilters,build_mr_total: { $lte: filters.max_mr,$gte: filters.min_mr }}
    }
    
    if (req.body.property_address_city.length>0 )
    {
        endFilters={...endFilters,property_address_city : { '$regex' : req.body.property_address_city, '$options' : 'i' }}         
    }
    
console.log(endFilters)
    Product.find(endFilters).limit(3)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data,
                FiltersAfterSearch:endFilters
            });
        });
};

// 
exports.listByFilterSQL =async (req, res) => {
// console.log(req.body,'req.body')
let obj={}
for (const property in req.body) {
    if(req.body[property]===false||req.body[property]==='')
    {
        obj={...obj,[property]:null}
    }else
    obj={...obj,[property]:req.body[property]}
}
let  {
    min_price,
    max_price,
    property_address_city,
    min_num_of_floors,
    max_num_of_floors,
    min_num_of_rooms,
    max_num_of_rooms,
    min_mr,
    air_condition,
    shelter,
    garage,
    pandor,
    furniture,
    handicapped,
    elevator,
    tadiran,
    unit,
    renovated,
    kosher,
    boiler,
    bars
}=obj

// console.log({
//     min_price,
//     max_price,
//     property_address_city,
//     min_num_of_floors,
//     max_num_of_floors,
//     min_num_of_rooms,
//     max_num_of_rooms,
//     min_mr,
//     air_condition,
//     shelter,
//     garage,
//     pandor,
//     furniture,
//     handicapped,
//     elevator,
//     tadiran,
//     unit,
//     renovated,
//     kosher,
//     boiler,
//     bars
// })


// is on pillar!
const result = await sql.query`select * from  
ProductsCostingMoreThan(${min_price},${max_price},${property_address_city},${min_num_of_floors},${max_num_of_floors}
    ,${min_num_of_rooms},${max_num_of_rooms},${min_mr},
    ${air_condition},${shelter},${garage},${pandor},${furniture},
    ${handicapped},${elevator},${tadiran},${unit}
    ,${renovated},${kosher},${boiler},${bars})`
    
    const filterSTR=`(${min_price},${max_price},${property_address_city},${min_num_of_floors},${max_num_of_floors}
        ,${min_num_of_rooms},${max_num_of_rooms},${min_mr},
        ${air_condition},${shelter},${garage},${pandor},${furniture},
        ${handicapped},${elevator},${tadiran},${unit}
        ,${renovated},${kosher},${boiler},${bars})`

console.log(result.rowsAffected,'result.recordsetsresult.recordsetsresult.recordsets')
// res.status(200).send(result.recordsets)
    res.json({
        size: result.rowsAffected,
        data:result.recordsets,
        FiltersAfterSearch:filterSTR
                });  
// const a=await pool.request()
// .input('minPrice', sql.Int, min_price)
// .input('maxPrice', sql.Int, max_price)
// .input('property_address_city', sql.NVarChar, property_address_city)
// .input('minFloor', sql.Int, min_num_of_floors)
// .input('maxFloor', sql.Int, max_num_of_floors)
// .input('minNumOfRooms', sql.Int, min_num_of_rooms)
// .input('maxNumOfRooms', sql.Int, max_num_of_rooms)
// .input('is_on_pillars', sql.Bit, null)
// .input('minBuild_mr', sql.Int, min_mr)
// .input('air_condition', sql.Bit, air_condition)
// .input('shelter', sql.Bit, shelter)
// .input('garage', sql.Bit, garage)
// .input('pandor', sql.Bit, pandor)
// .input('furniture', sql.Bit, furniture)
// .input('handicapped', sql.Bit, handicapped)
// .input('elevator', sql.Bit, elevator)
// .input('tadiran', sql.Bit, tadiran)
// .input('unit', sql.Bit, unit)
// .input('renovated', sql.Bit, renovated)
// .input('kosher', sql.Bit, kosher)
// .input('boiler', sql.Bit, boiler)
// .input('bars', sql.Bit, bars)
// .execute('ProductsCostingMoreThan') 
// console.log(a)
// let querySearch=`SELECT * FROM products WHERE`;
// let filters={}
// let endFilters={}
// let booleanFilters={}
// for(key in req.body){
//                 if ( req.body[key] === true) {
//                 booleanFilters={...booleanFilters,[key]:(req.body[key]) }
//                 querySearch=querySearch+` ${[key]} = 'true' AND` 
//                 console.log(querySearch,'querySearch')
//                 endFilters={...endFilters,[key]: {$eq: true}}
//             }


//         if(req.body[key]!==null&&req.body[key]!==undefined&&req.body[key]!==NaN&&req.body[key].length>0&&req.body[key]!==false)
//         {
//                 filters={...filters,[key]:parseFloat(req.body[key]) }
//             }   
//              }
//     if ('min_num_of_rooms' in filters   )
//     {
//         querySearch=querySearch+` num_of_rooms >= '${filters.min_num_of_rooms}' AND` 
//         endFilters={...endFilters,num_of_rooms: { $gte: filters.min_num_of_rooms }}
//     }
//     if ('max_num_of_rooms' in filters   )
//     {
//         querySearch=querySearch+` num_of_rooms <= '${filters.max_num_of_rooms}' AND` 
//         endFilters={...endFilters,num_of_rooms: { $lte: filters.max_num_of_rooms }}
//     }
//     if ('max_num_of_rooms' in filters && 'min_num_of_rooms' in filters )
//     {
//         endFilters={...endFilters,num_of_rooms: { $lte: filters.max_num_of_rooms,$gte: filters. min_num_of_rooms }}
//     }
//     if ('min_price' in filters   )
//     {
//         querySearch=querySearch+` price >= '${filters.min_price}' AND` 
//         endFilters={...endFilters,price: { $gte: filters.min_price }}
//     }
//     if ('max_price' in filters   )
//     {
//         querySearch=querySearch+` price <= '${filters.max_price}' AND` 
//         endFilters={...endFilters,price: { $lte: filters.max_price }}
//     }
//     if ('max_price' in filters && 'min_price' in filters )
//     {
//         endFilters={...endFilters,price: { $lte: filters.max_price,$gte: filters.min_price }}
//     } 
//     if ('min_num_of_floors' in filters   )
//     {
//         querySearch=querySearch+` property_floor >= '${filters.min_num_of_floors}' AND` 
//         endFilters={...endFilters,property_floor: { $gte: filters.min_num_of_floors }}
//     }
//     if ('max_num_of_floors' in filters   )
//     {
//         querySearch=querySearch+` property_floor <= '${filters.max_num_of_floors}' AND` 
//         endFilters={...endFilters,property_floor: { $lte: filters.max_num_of_floors }}
//     }
//     if ('max_num_of_floors' in filters && 'min_num_of_floors' in filters )
//     {
//         endFilters={...endFilters,property_floor: { $lte: filters.max_num_of_floors,$gte: filters.min_num_of_floors }}
//     } 
//     if ('min_mr' in filters   )
//     {
//         querySearch=querySearch+` build_mr_total >= '${filters.min_mr}' AND` 
//         endFilters={...endFilters,build_mr_total: { $gte: filters.min_mr }}
//     }
//     if ('max_mr' in filters   )
//     {
//         querySearch=querySearch+` build_mr_total <= '${filters.max_mr}' AND` 
//         endFilters={...endFilters,build_mr_total: { $lte: filters.max_mr }}
//     }
//     if ('max_mr' in filters && 'min_mr' in filters )
//     {
//         endFilters={...endFilters,build_mr_total: { $lte: filters.max_mr,$gte: filters.min_mr }}
//     }
    
//     if (req.body.property_address_city.length>0 )
//     {
//         querySearch=querySearch+` property_address_city ILIKE '%${req.body.property_address_city}%' AND` 
//         endFilters={...endFilters,property_address_city : { '$regex' : req.body.property_address_city, '$options' : 'i' }}         
//     }   
//     if (req.body.entery_date!=null )
//     {
//         querySearch=querySearch+` entry_date <= '${req.body.entery_date}' AND` 
//         endFilters={...endFilters,property_address_city : { '$regex' : req.body.property_address_city, '$options' : 'i' }}         
//     }   
// if(querySearch.endsWith("AND"))
// {
//     querySearch = querySearch.slice(0, -3)
// } 
// if(querySearch.endsWith("WHERE"))
// {
//     querySearch = querySearch.slice(0, -5)
// } 
// console.log('final query',querySearch)
// try {
//     const result=await client.query(querySearch)  
//     res.json({
//         size: result.rowCount,
//         data:result.rows,
//         FiltersAfterSearch:querySearch
//                 });    
// } catch (error) {
//     return res.status(400).json({
//                 error: "Products not found"
//             });
// }

};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select("-photo");
    }
};
