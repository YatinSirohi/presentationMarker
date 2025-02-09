const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const uri = 'add mongodb url'

app.post('/add-student', async (req, res) => {
  const { name, points } = req.body;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('students');
    const collection = database.collection('students');

    // Insert student name
    const result = await collection.insertOne({ name, points });
    res.status(200).send({ success: true, result });
    await client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.delete('/delete-students', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('students');
    const collection = database.collection('students');

    // Delete all documents in the collection
    const result = await collection.deleteMany({});
    res.status(200).send({
      success: true,
      message: `${result.deletedCount} student(s) deleted successfully`,
    });

    await client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get('/get-student', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('students');
    const collection = database.collection('students');

    //find student names array
    const result = await collection.find({}).toArray();
    console.log(result)
    res.status(200).send({
      success: true,
      message: result,
    });

    await client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.put('/update-points', async (req, res) => {
  const { name, points } = req.body;
  if (!name || points === undefined) {
    return res.status(400).send({
      success: false,
      error: 'Name and points are required',
    });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('students');
    const collection = database.collection('students');

    // Update the points array for the student with the given name
    const result = await collection.updateOne(
      { name },
      { $push: { points } }
    );

    if (result.matchedCount === 0) {
      res.status(404).send({
        success: false,
        error: 'Student not found',
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Points updated for student ${name}`,
      });
    }

    await client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

