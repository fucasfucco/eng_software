//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://fuca:147896325@cluster0.a2bqb.mongodb.net/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = {
    name: String,
    sellerId: Number,
    weight: Number,
    height: Number,
    quantityOfKnives: Number,
    age: Number
};

const Product = mongoose.model("Product", productSchema);

const sellerSchema = {
    name: String,
    price: Number,
    sellerId: Number,
    totalAmmount: Number,
    sellerComission: Number,
    shipping: String
};

const Seller = mongoose.model("Seller", sellerSchema);


app.get("/", function (req, res) {
    res.redirect("home");
});

app.get("/home", function (req, res) {
    res.render("home");
});

app.get("/createSeller", function(req,res){
    res.render("createSeller");
});

app.get("/sellers", function (req, res) {
    Seller.find({}, function (err, foundSellers) {
        if (!err) {
            res.render("sellers", {
                foundSellers: foundSellers,
                 }
            );
        }else{
            res.send(err);
            console.log("[ERROR] Please contact the administrator.");
        }

    })
})

app.get("/productsT", function (req, res) {
    Product.find({}, function (err, foundProducts) {
        if (!err) {
            res.render("productsT", {
                foundProducts: foundProducts,
                 }
            );
        }else{
            res.send(err);
            console.log("[ERROR] Please contact the administrator.");
        }

    })
})


app.get("/products", function (req, res) {
    res.render("products");
});

app.route("/seller")

    .get(function (req, res) {
        res.redirect("/sellers");
    })

    .post(function (req, res) {

        const sellerIdCreation = Math.floor(Date.now() / 1000);
        const newSeller = new Seller({
            name: req.body.name,
            sellerId: sellerIdCreation,
            totalAmmount: 0,
            sellerComission: req.body.comission,
            shipping: req.body.shipping
        });

        newSeller.save(function (err) {
            if (!err) {
                res.send("Successfully added a new seller.");
            } else {
                console.log("[ERROR] Please contact the administrator.");
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        const id = req.body.sellerId;
        Seller.findOneAndDelete({ sellerId: id }, function (err) {
            if (!err) {
                res.redirect("home");
                console.log("Successfully deleted Seller.");
            } else {
                console.log("[ERROR] Please contact the administrator.");
                res.send(err);
            }
        });
    });

app.route("/product")

    .get(function (req, res) {
        res.redirect("/products");
    })

    .post(function (req, res) {
        Seller.findOne({ sellerId: req.body.sellerId }, function (err, seller) {
            if (!err) {
                if (ammount != null) {
                    var ammount = seller.totalAmmount;
                    ammount++;

                    Seller.findOneAndUpdate({ sellerId: req.body.sellerId }, { $set: { totalAmmount: ammount } }, function (err) {
                        if (!err) {
                            console.log("Succesfully updated!");

                            const newProduct = new Product({
                                name: req.body.name,
                                sellerId: req.body.sellerId,
                                price: req.body.price,
                                weight: req.body.weight,
                                height: req.body.height,
                                quantityOfKnives: req.body.knives,
                                age: req.body.age
                            });

                            newProduct.save(function (err) {
                                if (!err) {
                                    res.write('<script>alert("Succesfully added new product")</script>');
                                } else {
                                    res.send(err);
                                }
                            });
                        } else {
                            console.log("[ERROR] Please contact the administrator.");
                        }
                    });
                } else {
                    console.log("[ERROR] Seller doesn't exist!");
                    res.render("errorSeller");
                }

            } else {
                console.log("[ERROR] Please contact the administrator.");
            }
        });


    })


app.listen(3000, () => {
    console.log("Server started on port 3000");
});