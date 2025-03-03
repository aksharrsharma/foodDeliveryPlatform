const model = require('../models/item'); // import the item model


//GET /items: send all items to user 
exports.index = (req, res) =>{
    model.find().sort({price: 1})
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
    let item = new model(req.body); // create a new story document
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
    model.findById(id) // join the authorID with seller so we can get their name 
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
    res.send('Send the edit form');
};

//PUT /items/:id: update the item identified by id
exports.update = (req, res)=>{
    res.send('Update an item with id ' + req.params.id);
};

//DELETE /items/:id: send details of an item identified by id
exports.delete = (req, res)=>{
    res.send('Delete an item with id '+ req.params.id);
};
