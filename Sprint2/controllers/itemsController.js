const Item = require('../models/item'); // import the item Item
const Order = require('../models/order'); // import the item Item

//GET /items: send all items to user 
exports.index = (req, res) =>{
    Item.find().sort({price: 1})
    .then(items=>{
        res.render('./item/items', {items});
    })
    .catch(err=>next(err));

};

//GET /items/new: send html form for creating a new item
exports.new = (req, res) =>{
    res.render('./item/new');
};


//POST /items: create a new item 
exports.create = (req, res) =>{
    let item = new Item(req.body); // create a new story document
    // Handle file upload
    if(req.file){ // must have if for validation (no image then you cannot append req.file.filename)
        item.image = '/images/uploads/' + req.file.filename; // Store image path
    }
    
    // save the item
    item.save() 
    .then(item=>{
        console.log(item);
        req.flash('success', 'You have successfully created and added: ' + item.name);
        req.session.save(()=>res.redirect('/items'));
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
            req.flash('error', err.message);
            return req.session.save(()=>res.redirect('back'));
        } 
        next(err);
        
    });
};

//GET /items/:id: send details of an item identified by id
exports.show = (req, res) =>{
    let id = req.params.id; //string type
    Item.findById(id) // join the authorID with seller so we can get their name 
    .then(item=>{ //consume the promise from findById
        if(item){
            return res.render('./item/show', {item}); //item is the object in show.ejs
        }else{
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404; // we cannot find the item so set its status to 404
            req.flash('error', err.message, '- Error status: ', err.status);
            req.session.save(()=>res.redirect('back'));
        }
    })
    .catch(err=>next(err));
};

//GET /items/:id/edit: send html for mfor editing an existing item
exports.edit = (req, res) =>{
    let id = req.params.id;
    Item.findById(id)
    .then(item=>{
        return res.render('./item/edit', {item});
    })
    .catch(err=>next(err));

};

function capitalizeWords(str) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

//PUT /items/:id: update the item identified by id
exports.update = (req, res)=>{
    let editedItem = req.body;
    let id = req.params.id;

    if(req.file){
        editedItem.image = '/images/uploads/' + req.file.filename; // Store image path
    }

    Item.findById(id)
    .then(item=>{
        if(editedItem.name == item.name && editedItem.price == item.price && editedItem.description == item.description && !req.file){
            return req.session.save(()=>res.redirect('/items'));
        } else{
            Item.findByIdAndUpdate(id, editedItem, {useFindAndModify: false, runValidators: true})
            .then(item=>{
                req.flash('success', capitalizeWords(item.name)+' was updated successfully!');
                req.session.save(()=>res.redirect('/items/'+id));
            })
        }
    })

    
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
            req.flash('error', err.message);
            return req.session.save(()=>res.redirect('back'));
        } 
        next(err);
    });
};

//DELETE /items/:id: send details of an item identified by id
exports.delete = (req, res)=>{
    let id = req.params.id;
    Item.deleteMany({item: id})
    .then(()=>{
        return Item.findByIdAndDelete(id, {useFindAndModify: false})
    })
    .then(item=>{
        req.flash('success', 'Your item was deleted successfully!');
        req.session.save(()=>res.redirect('/items'));
    })
    .catch(err=>next(err));
};


