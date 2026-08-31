import mongoose from 'mongoose';
const SiteSchema = new mongoose.Schema({ key:{type:String,unique:true}, data:{type:Object,required:true} },{timestamps:true});
export default mongoose.models.Site || mongoose.model('Site', SiteSchema);
