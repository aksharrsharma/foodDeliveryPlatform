const Item = require('../models/item');
const Order = require('../models/order');

exports.index = (req, res, next) => {
    Item.find().sort({ price: 1 })
        .then(items => res.render('./item/items', { items }))
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./item/new');
};


exports.create = (req, res, next) => {
    let item = new Item(req.body);
    if (req.file) {
        item.image = '/images/uploads/' + req.file.filename;
    }

    item.save()
        .then(item => {
            req.flash('success', 'You added: ' + item.name);
            req.session.save(() => res.redirect('/items'));
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                err.status = 400;
                return req.session.save(() => res.redirect('back'));
            }
            next(err);
        });
};


exports.show = (req, res, next) => {
    let id = req.params.id;
    Item.findById(id)
        .then(item => {
            if (item) {
                res.render('./item/show', { item });
            } else {
                const err = new Error('Cannot find item with id ' + id);
                err.status = 404;
                req.flash('error', err.message);
                req.session.save(() => res.redirect('back'));
            }
        })
        .catch(err => next(err));
};


exports.edit = (req, res, next) => {
    let id = req.params.id;
    Item.findById(id)
        .then(item => res.render('./item/edit', { item }))
        .catch(err => next(err));
};


exports.update = async (req, res, next) => {
    const id = req.params.id;
    const editedItem = req.body;

    try {
        const item = await Item.findById(id);
        if (!item) {
            req.flash('error', 'Item not found');
            return req.session.save(() => res.redirect('back'));
        }

        // Update changed fields
        item.name = editedItem.name || item.name;
        item.price = editedItem.price || item.price;
        item.description = editedItem.description || item.description;

        if (req.file) {
            item.image = '/images/uploads/' + req.file.filename;
        }

        await item.save(); // Important for applying changes

        req.flash('success', 'Item updated successfully!');
        req.session.save(() => res.redirect(`/items/${id}`));
    } catch (err) {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            err.status = 400;
            return req.session.save(() => res.redirect('back'));
        }
        next(err);
    }
};


exports.delete = (req, res, next) => {
    let id = req.params.id;
    Item.deleteMany({ item: id })
        .then(() => Item.findByIdAndDelete(id))
        .then(() => {
            req.flash('success', 'Your item was deleted successfully!');
            req.session.save(() => res.redirect('/items'));
        })
        .catch(err => next(err));
};
