const mongoose=require("mongoose");
const data1=require("./data.js");

const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("connection to database was sucessfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}



const iniData=async ()=>{

    await Listing.deleteMany({});
    await Listing.insertMany(data1.data);
    
    console.log("Data was deleted and inserted sucessfully");
}

iniData();