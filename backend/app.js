const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://FinproKemjar20:MbuyMpruy@finproprakkemjar.xzuzsrl.mongodb.net/?appName=FinproPrakKemjar';
const client = new MongoClient(mongoUri);
let usersColl, todosColl;

(async () => {
    try {
        await client.connect();
        const db = client.db('FinproKemjar');
        usersColl = db.collection('users');
        todosColl = db.collection('todos');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
})();

// Register user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!usersColl) return res.status(503).json({ message: 'Database initializing' });
    (async () => {
        try {
            const result = await usersColl.insertOne({ username, password });
            res.json({ message: 'User registered successfully', userId: result.insertedId.toString() });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Registration failed', error: err.message });
        }
    })();
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!usersColl) return res.status(503).json({ message: 'Database initializing' });
    (async () => {
        try {
            const user = await usersColl.findOne({ username, password });
            if (user) {
                res.json({ message: 'Login successful', userId: user._id.toString() });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Database error' });
        }
    })();
});

// Get todos for a user
app.get('/todos/:userId', (req, res) => {
    const { userId } = req.params;
    if (!todosColl) return res.status(503).json({ message: 'Database initializing' });
    (async () => {
        try {
            const docs = await todosColl.find({ user_id: userId }).toArray();
            const rows = docs.map(d => ({ id: d._id.toString(), content: d.content }));
            res.json(rows);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Database error' });
        }
    })();
});

// Add todo
app.post('/todos', (req, res) => {
    const { userId, content } = req.body;
    if (!todosColl) return res.status(503).json({ message: 'Database initializing' });
    (async () => {
        try {
            const result = await todosColl.insertOne({ user_id: userId, content });
            res.json({ message: 'Todo added', entryId: result.insertedId.toString() });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to add todo', error: err.message });
        }
    })();
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!todosColl) return res.status(503).json({ message: 'Database initializing' });
    (async () => {
        try {
            await todosColl.deleteOne({ _id: new ObjectId(id) });
            res.json({ message: 'Todo deleted' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to delete todo', error: err.message });
        }
    })();
});

// Change password
app.post('/change-password', (req, res) => {
    const { userId, newPassword } = req.body;
    if (!usersColl) return res.status(503).json({ message: 'Database initializing' });
    (async () => {
        try {
            const resu = await usersColl.updateOne({ _id: new ObjectId(userId) }, { $set: { password: newPassword } });
            if (resu.modifiedCount && resu.modifiedCount > 0) {
                res.json({ message: 'Password changed successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to change password', error: err.message });
        }
    })();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
