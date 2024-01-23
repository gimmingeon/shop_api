import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    content : {
        type: String,
        required: true,
    },
    author : {
        type: String,
        required: true,
    },
    password : {
        type: Number,
        required: true,
    },
    status : {
        type: String,
        default: "FOR_SALE",
        enum: ["FOR_SALE", "SOLD_OUT"],
    },
    createdAt : {
        type: Date,
        default: Date.now,
    },
});

shopSchema.virtual('shopId').get(function () {
    return this._id.toHexString();
  });
  shopSchema.set('toJSON', {
    virtuals: true,
  });

export default mongoose.model('Shop', shopSchema);