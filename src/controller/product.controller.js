const { product, productCategory, category, user } = require("../../models");
const { Op } = require("sequelize");
const fs = require("fs");

exports.addProduct = async (req, res) => {
  const userId = req.user.id;
  try {
    let { categoryId } = req.body;
    categoryId = categoryId.split(",");

    const data = {
      user_id: userId,
      title: req.body.title,
      image: req.file.filename,
    };

    let newProduct = await product.create(data);

    const productCategoryData = categoryId.map((item) => {
      return { product_id: newProduct.id, category_id: parseInt(item) };
    });

    await productCategory.bulkCreate(productCategoryData);

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    productData = JSON.parse(JSON.stringify(productData));

    res.send({
      status: "success",
      data: {
        ...productData,
        image: process.env.PATH_FILE + productData.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const productData = await product.findOne({
      where: {
        id: id,
      },
    });

    if (productData.user_id != userId) {
      res.status(401).send({
        status: "failed error",
        message: "Unauthorized data product",
      });
      return;
    }

    await fs.unlink(`storage/upload/${productData.image}`, function (err) {
      if (err) {
        throw res.status(500).json({
          message: "delete image failed!",
        });
      }
    });

    let { categoryId } = req.body;
    categoryId = categoryId.split(",");

    const data = {
      user_id: userId,
      title: req?.body?.title,
      image: req?.file?.filename,
    };

    await productCategory.destroy({
      where: {
        product_id: id,
      },
    });

    let productCategoryData = [];
    if (categoryId != 0 && categoryId[0] != "") {
      productCategoryData = categoryId.map((item) => {
        return { product_id: parseInt(id), category_id: parseInt(item) };
      });
    }

    if (productCategoryData.length != 0) {
      await productCategory.bulkCreate(productCategoryData);
    }

    await product.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      data: {
        id,
        data,
        productCategoryData,
        image: process.env.PATH_FILE + req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await product.findOne({
      where: {
        id: id,
      },
    });

    if (data.user_id != req.user.id) {
      res.status(401).send({
        status: "failed error",
        message: "Unauthorized data product",
      });
      return;
    }

    await fs.unlink(`storage/upload/${data.image}`, function (err) {
      if (err) {
        throw res.status(500).json({
          message: "delete image failed!",
        });
      }
    });

    await product.destroy({
      where: {
        id,
      },
    });

    await productCategory.destroy({
      where: {
        product_id: id,
      },
    });

    res.send({
      status: "success",
      message: `Delete product id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    let data = await product.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: user,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return { ...item, image: process.env.PATH_FILE + item.image };
    });

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    let data = await product.findOne({
      where: {
        [Op.and]: [{ id: id }, { user_id: userId }],
      },
      include: [
        {
          model: user,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      image: process.env.PATH_FILE + data.image,
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      users: {
        ...data.users,
      },
      categories: data.categories,
    };
    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
