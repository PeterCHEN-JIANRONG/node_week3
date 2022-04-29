var express = require("express");
var router = express.Router();
const { errorHandle, successHandle } = require("../services/httpHandle");
const Post = require("../models/post");

// 取得貼文
router.get("/", async (req, res, next) => {
  const posts = await Post.find();
  successHandle(res, posts);
});

// 新增貼文
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const { name, content, image, tags, type, likes, comments } = data;

    // 前端阻擋 - 欄位格式不正確
    if (name === undefined) {
      errorHandle(res, "姓名未填寫");
    } else if (content === undefined) {
      errorHandle(res, "內容未填寫");
    } else if (tags === undefined) {
      errorHandle(res, "標籤未填寫");
    } else if (type === undefined) {
      errorHandle(res, "貼文類型未填寫");
    } else {
      // 新增資料
      const postData = {
        name,
        content,
        image,
        tags,
        type,
        likes,
        comments,
      };
      const newPost = await Post.create(postData);
      successHandle(res, newPost);
    }
  } catch (err) {
    errorHandle(res, err);
  }
});

// 刪除全部貼文
router.delete("/", async (req, res) => {
  await Post.deleteMany({});
  const posts = await Post.find();
  successHandle(res, posts);
});

// 刪除單筆貼文 by Id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await Post.findByIdAndDelete(id);
    if (deletePost !== null) {
      successHandle(res, deletePost); // 單筆刪除成功
    } else {
      errorHandle(res, "查無此 ID"); // 查無 id
    }
  } catch (err) {
    // 預防: 網址未帶入 id
    errorHandle(res, err);
  }
});

// 更新貼文 by Id
router.patch("/:id", async (req, res) => {
  try {
    const data = req.body;
    const { name, content, image, tags, type, likes, comments } = data;
    const { id } = req.params;
    const postData = {
      name,
      content,
      image,
      tags,
      type,
      likes,
      comments,
    };
    const options = {
      new: true, // 回傳更新"後"的資料, default: false 回傳更新"前"的資料
    };
    const editPost = await Post.findByIdAndUpdate(id, postData, options);

    if (editPost !== null) {
      successHandle(res, editPost);
    } else {
      errorHandle(res, "查無此 ID"); // 查無 id
    }
  } catch (err) {
    // 預防: JSON 解析失敗、網址未帶入 id
    errorHandle(res, err);
  }
});

module.exports = router;
