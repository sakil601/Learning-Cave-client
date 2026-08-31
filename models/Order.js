import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
  customer:{name:String,phone:String,email:String}, items:[{slug:String,title:String,category:String,price:Number,discount:Number,finalPrice:Number,sku:String}],
  total:{type:Number,required:true}, payment:{method:String,account:String,transactionId:String,status:{type:String,default:'pending'}}, status:{type:String,default:'pending'}
},{timestamps:true});
export default mongoose.models.Order || mongoose.model('Order',OrderSchema);
