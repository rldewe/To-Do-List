//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//create database with mongodb

mongoose.connect("mongodb+srv://srishtiy03:test123@cluster0.gsufpnw.mongodb.net/?retryWrites=true&w=majority/todolistDB", {
  useNewUrlParser: true
})

//creating items schema
const itemsSchema={
  name:String
};

//creating mongoose model collection
const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist!"
});
const item2=new Item({
  name:"Hit + to add a new item."
});
const item3=new Item({
  name:"Hit this to delete an item."
});


const defItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

/*
app.get("/", function (req, res) {
Item.find().then(foundItems=>{ res.render("list", { listTitle: "Today" ,newListItems:foundItems})
if(foundItems.length==0){
  Item.insertMany(defItems);

}

})
});

*/

app.get("/", function (req, res) {
  Item.find().then(foundItems=>{ res.render("list", { listTitle: "Today" ,newListItems:foundItems})
  if(foundItems.length==0){
    Item.insertMany(defItems);
  
  }
  
  })
  });

app.get("/:customListName",function(req,res){
  const customListName =req.params.customListName;
List.findOne({name:customListName})


  const list=new List({
    name:customListName,
    items:defItems
  });

  list.save();
})

app.post("/",function(req,res){
    const itemName=req.body.newItem;

  const item=new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");

})

app.post("/delete",async(req,res)=>{
  try{
    const itemID=req.body.checkboxes;
    await Item.findByIdAndDelete(itemID);
     //res.send(`Item ${itemID} deleted successfully`);
     res.redirect("/");
  }catch(error){
    console.error(error);
  }
})






app.listen(3000, function () {
  console.log("Server started on port 3000");
});
