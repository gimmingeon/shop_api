import express from 'express';
import Shop from '../schemas/shop.schema.js'

const router = express.Router();

// 상품 등록
router.post('/shops', async (req, res) => {
    const { title, content, author, password } = req.body;

    if (!title || !content || !author || !password) {
        return res.status(400).json({ errorMessage: "데이터를 제대로 입력하시오" });
    }

    const shop = new Shop({ title, content, author, password });
    await shop.save();

    return res.status(201).json({ shop: shop });

});

// 상품 목록 조회
router.get('/shops', async (req, res) => {

    const products = await Shop.find().sort({ createdAt: -1 }).exec();
    const products_info = products.map(products => ({
        title: products.title,
        author: products.author,
        status: products.status,
        createdAt: products.createdAt
    }));

    return res.status(200).json({ products: products_info });
});

// 상품 상세 조회
router.get('/shops/:shopId', async (req, res) => {
    const { shopId } = req.params;
    const products = await Shop.findById(shopId).exec();

    if (!products) {
        return res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다" });
    }

    const { title, content, author, status, createdAt } = products;

    return res.status(200).json({ title, content, author, status, createdAt });

});

// 상품 정보 수정
router.patch('/shops/:shopId', async (req, res) => {
    const { shopId } = req.params;

    const { title, content, status, password } = req.body

    const products = await Shop.findById(shopId).exec();

    if (!products) {
        return res.status(404).json({ errorMessage: '상품조회에 실패하였습니다' });
    }

    if (password !== products.password) {
        return res.status(401).json({ errorMessage: "비밀번호가 틀렸습니다" });
    }

    if (title) {
        products.title = title;
    }
    if (content) {
        products.content = content;
    }
    if (status) {
        products.status = status;
    }

    await products.save();

    return res.status(200).json({ products });


});

// 상품 삭제
router.delete('/shops/:shopId', async (req, res) => {
    const { shopId } = req.params;
    const { password } = req.body;

    const products = await Shop.findById(shopId).exec();

    if (!products) {
        return res.status(404).json({ errorMessage: "상품 조회에 싫패했습니다" });
    }

    if (password && password === products.password) {
        await Shop.deleteOne({ _id: shopId });
        return res.status(200).json({ message: "상품을 삭제했습니다" });
    }
    else {
        return res.status(401).json({ errorMessage: "비밀번호가 틀렸습니다" });
    }


});


export default router;