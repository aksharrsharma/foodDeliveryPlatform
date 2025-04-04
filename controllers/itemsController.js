const model = require('../models/item');

exports.index = (req, res) => {
    model.find().sort({ price: 1 })
        .then(items => {
            res.render('./item/items', { items });
        })
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./item/new');
};

exports.create = (req, res, next) => {
    if (!req.session.user) {
        if (process.env.NODE_ENV === 'test') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        req.flash('error', 'Login required');
        return res.redirect('/users/login');
    }

    let item = new model(req.body);

    if (req.file) {
        item.image = '/images/uploads/' + req.file.filename;
    }

    item.save()
        .then(item => {
            if (process.env.NODE_ENV === 'test') {
                return res.status(201).json({ message: 'Item created', item });
            }
            req.flash('success', 'You have successfully created and added: ' + item.name);
            req.session.save(() => res.redirect('/items'));
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                if (process.env.NODE_ENV === 'test') {
                    return res.status(400).json({ error: err.message });
                }
                req.flash('error', err.message);
                return req.session.save(() => res.redirect('back'));
            }
            next(err);
        });
};

exports.show = (req, res) => {
    let id = req.params.id;
    model.findById(id)
        .then(item => {
            if (item) {
                return res.render('./item/show', { item });
            } else {
                let err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                req.flash('error', err.message);
                req.session.save(() => res.redirect('back'));
            }
        })
        .catch(err => next(err));
};

exports.edit = (req, res) => {
    res.send('Send the edit form');
};

exports.update = (req, res) => {
    res.send('Update an item with id ' + req.params.id);
};

exports.delete = (req, res) => {
    res.send('Delete an item with id ' + req.params.id);
};
