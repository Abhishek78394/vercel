const User = require("../models/userModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
exports.homepage = (req, res, next) => {
  res.send("This is homepage...");
  // res.json({})
};
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomPassword = () => {
  const min = 1000000;
  const max = 9999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};



exports.signup = async (req, res, next) => {
  try {
    let user = await User.findOne({ user_id: req.body.user_id }).exec();
    if (user) {
      return res.status(501).json({ message: "user exists" });
    }
   
    const user_id = generateRandomString(10);
    const password = generateRandomPassword();
    const newUser = new User({
      ...req.body,
      user_id,
      password,
    }); 
     user = await newUser.save();
    return res.json(user);
    res.json(user);
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};


exports.signin = async (req, res, next) => {
  try {
    const { user_id, password } = req.body;
    let user = await User.findOne({ user_id }).exec();
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const token = jwt.sign({ id: user.id }, "secretkey");
    const datas = { user, token }
    res.cookie("accessToken", token, {
      maxAge: 999900000,
      httpOnly: true,
    })
      .status(200)
      .json(datas);
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};


exports.getAllUSer = async (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json("Not logged in!")
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const users = await User.find().exec();
    res.status(200).json({ message: "all blogs", users });
  })
}

exports.delete_User = async (req, res, next) => {
  const userId = req.query.id;
try {
  const deletedUser = await User.findOneAndDelete({_id: userId});

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    });
} catch (error) {
  console.log(error)
}
}
exports.update_user = async (req, res, next) => {
  const userId = req.body.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}

exports.signout = (req, res, next) => {
  const token = req.query.token;
  res.clearCookie("token");
  res.status(200).json({ message: "logged out sexsexfully" });
};



exports.product_create = async (req, res) => {
    const token = req.body.token
    console.log(token)
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      console.log("object")
      const product = new Product({
        unique_no: req.body.unique_no,
        pieces: req.body.pieces,
        city: req.body.city,
        status: req.body.status
      });
      try {
        let pro = await Product.find({ unique_no: req.body.unique_no }).exec();
        const products = pro[0];
        if (products) {
          if (products.unique_no == product.unique_no) {
            if (products.status == product.status) {
              console.log("product code no doesn't vaild");
             return res.status(401).json("product code no doesn't vaild!");
            } else {
              console.log("created");
              console.log(product,products)
              const savedProduct = await Product.create({ unique_no: req.body.unique_no,
                pieces: req.body.pieces,
                city: req.body.city,
                status: req.body.status}).then((e)=>{
console.log(e)
                }).catch(err=>console.log(err))
              console.log(savedProduct, "jjjjjjjjjjj")
              res.status(200).json(savedProduct);
            }
          }
        }
        if (!products) {
            console.log("k");
          const savedProduct = await product.save();
         return res.status(200).json(savedProduct);
        }

        // const savedProduct = await product.save();
        // res.status(200).json(savedProduct);
    console.log("object")

      } catch (error) {
        res.status(400).send(error);
      }
    });
  };




exports.getAllProducts = async (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json("Not logged in!")
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const products = await Product.find().exec();
    res.status(200).json({ message: "all blogs", products });
  })
}


exports.delete_product = async (req, res, next) => {
  const userId = req.query.id;
  console.log(userId)
try {
  const deletedUser = await Product.findOneAndDelete({_id: userId});

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    });
} catch (error) {
  console.log(error)
}
}


exports.update_product = async (req, res, next) => {
  const Id = req.body.id;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(Id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedProduct,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}