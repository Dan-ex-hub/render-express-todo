const express = require("express");
const bodyParser = require("body-parser");

var app = express();
app.set("view engine", "ejs");    // Set EJS as the view engine
app.use(express.static('public')); // Serve static files from the 'public' folder (CSS, JS, etc.)
app.use(express.urlencoded({extended:true})); // Enable body-parser for URL-encoded data

// In-memory array to store todo items with priority
let items = [];


// Route for the home page - displays the list of todo items, with optional priority filter
app.get("/", function(req, res) {
    const filter = req.query.priority || "all";
    let filteredItems = items;
    if (filter !== "all") {
        filteredItems = items.filter(item => item.priority === filter);
    }
    res.render("list", { ejes: filteredItems, filter: filter });
});


// Route for adding new todo items
app.post("/", function(req, res) {
    const itemText = req.body.ele1 && req.body.ele1.trim();
    const priority = req.body.priority || "low";
    if (!itemText) {
        // If input is empty, redirect with error query
        return res.redirect("/?error=empty");
    }
    items.push({ name: itemText, priority: priority });
    res.redirect("/");
});


// Route for deleting todo items (uses index for simplicity)
app.post("/delete", function(req, res) {
    const index = parseInt(req.body.index);
    if (!isNaN(index) && index >= 0 && index < items.length) {
        items.splice(index, 1);
    }
    res.redirect("/");
});


// GET route to display the edit form for a specific item using its index
app.get("/edit/:itemIndex", function(req, res) {
    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex >= 0 && itemIndex < items.length) {
        res.render("edit", { currentItem: items[itemIndex], itemIndex: itemIndex });
    } else {
        res.redirect("/");
    }
});


// POST route to handle the submission of the edited item using its index
app.post("/edit", function(req, res) {
    const itemIndex = parseInt(req.body.itemIndex);
    const updatedItem = req.body.updatedItem && req.body.updatedItem.trim();
    const updatedPriority = req.body.updatedPriority || "low";
    if (itemIndex >= 0 && itemIndex < items.length && updatedItem) {
        items[itemIndex] = { name: updatedItem, priority: updatedPriority };
    }
    res.redirect("/");
});


// Start the server on port 5000
app.listen(5000,function(){
    console.log("Server started on port 5000");
});
