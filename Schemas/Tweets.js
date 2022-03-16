const mongoose= require('mongoose');


// while checcking for 1NF 2NF ,check whether on changing 1 column is forccing other
//column to change
const Schema = mongoose.Schema ;
const tweetsSchema = new Schema({
   title :{
       type:String,
       required : true
   },
  bodyText:{
      type : String,
      required : true
  },
  userId :{
      type :Schema.Types.ObjectId,
      required : true
  },
  creationDateTime :{
      type: String,
      required :true
  }
},{strict:false})
// strict false signifies that there may be further changes in schema ,like adding tags, images ,vedios etc.
module.exports=mongoose.model('tb_tweets',tweetsSchema,'tb_tweets');