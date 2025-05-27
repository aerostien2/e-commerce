const Product = require('../models/product');
const { errorHandler } = require('../auth');

// Admin-only: Create a new product
module.exports.createProduct = (req, res) => {

    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Product.findOne({ name: req.body.name })
    .then(existingProduct => {
        if (existingProduct) {
            return res.status(409).send(true);
        } else{
            return newProduct.save()
            .then(result => res.status(201).send(result))
            .catch(error => errorHandler(error, req, res));
        }
    }).catch(error => errorHandler(error, req, res));
};


//Retrieve all products

module.exports.getAllProducts = (req, res) => {
  return Product.find({})
  .then(result => {
        // if the result is not null send status 30 and its result
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            // 404 for not found courses
            return res.status(404).send({message : "No products found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//Retrieve all active products

module.exports.getAllActive = (req, res) => {

    Product.find({ isActive : true }).then(result => {
        // if the result is not null
        if (result.length > 0){
            // send the result as a response
            return res.status(200).send(result);
        }
        // if there are no results found
        else {
            // send the message as the response
            return res.status(404).send({message: 'No active products found'})
        }
    }).catch(err => res.status(500).send(err));

};

//Retrieve single product

module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            return res.status(200).send(product);
        } else {
            return res.status(404).send({message: 'Product not found'});
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};


//Update product info

module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(product => {
        if (product) {
            res.status(200).send(
                {
                    success: true,
                    message: "Product updated successfully"
                }
                );
        } else {
            res.status(404).send({message: "Product not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};


//Archive product

module.exports.archiveProduct = (req, res) => {
  
    let updateActiveField = {
        isActive: false
    };

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {
                if (!product.isActive) {
                    return res.status(200).send({
                        message: "Product already archived",
                        archivedProduct: product
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Product archived successfully"
                });
            } else {
                return res.status(404).send({
                    message: "Product not found"
                });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//Activate Product

module.exports.activateProduct = (req, res) => {
  
    let updateActiveField = {
        isActive: true
    }

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {
                if (product.isActive) {
                    return res.status(200).send({ 
                        message: 'Product already active', 
                        activateProduct: product
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'Product activated successfully'
                });
            } else {
                return res.status(404).send({ message: 'Product not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};