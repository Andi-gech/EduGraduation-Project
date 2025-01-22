const mongoose=require('mongoose')
const joi=require('joi')
const NotificationsSchema=new mongoose.Schema({
    notification:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth",
        default: null,
    },
    isForAdmin: {
        type: Boolean,
        default: false, // True for admin-specific notifications
      },
    date:{
        type:Date,
        default:Date.now
    },
    type:{
        type:String,
        enum:["General","Announcement","Notice"],
        default:"General",
      
    }
})
const Notifications=mongoose.model('Notifications',NotificationsSchema)
module.exports={Notifications}