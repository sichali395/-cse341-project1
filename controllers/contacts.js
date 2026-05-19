const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all contacts
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().collection('contacts').find();
        const lists = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single contact by path parameter :id
const getSingle = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('contacts').find({ _id: userId });
        const lists = await result.toArray();
        if (lists.length === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST – create new contact
const createContact = async (req, res) => {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate all fields are present
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All fields (firstName, lastName, email, favoriteColor, birthday) are required.' });
    }

    const newContact = {
        firstName,
        lastName,
        email,
        favoriteColor,
        birthday
    };

    try {
        const response = await mongodb.getDatabase().collection('contacts').insertOne(newContact);
        if (response.acknowledged) {
            return res.status(201).json({ id: response.insertedId });
        } else {
            return res.status(500).json({ message: 'Failed to create contact.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PUT – update contact by ID
const updateContact = async (req, res) => {
    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate all fields are present
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All fields are required for update.' });
    }

    const updatedContact = {
        firstName,
        lastName,
        email,
        favoriteColor,
        birthday
    };

    try {
        const result = await mongodb.getDatabase()
            .collection('contacts')
            .replaceOne({ _id: contactId }, updatedContact);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        return res.status(204).send(); // No content – successful update
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE – remove contact by ID
const deleteContact = async (req, res) => {
    const contactId = new ObjectId(req.params.id);

    try {
        const result = await mongodb.getDatabase()
            .collection('contacts')
            .deleteOne({ _id: contactId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        return res.status(204).send(); // No content – successful deletion
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};