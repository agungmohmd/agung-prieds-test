const express = require('express');
const router = express.Router();

const Entry = require('../models/Entry');

var bodyParser = require('body-parser');
const { update } = require('../models/Entry');

router.use(bodyParser.json())
router.use(
    bodyParser.urlencoded({
        extended: true
    })
)

let yest = new Date()
yest.setDate(yest.getDate() - 1)
yest.toLocaleDateString()
let tom = new Date()
tom.setDate(tom.getDate() + 1)
tom.toLocaleDateString()
let today = new Date().toLocaleDateString()

// Get All Entry
router.get('/entry', async (req, res) => {
    try {
        let entry
        let query = {}

        Object.assign(query, req.query.status && {"entryStatus": req.query.status},
        req.query.from_date && req.query.to_date && {"entryDate": { "$gte": req.query.from_date, "$lt": req.query.to_date }})

        console.log(query)
        entry = await Entry.find(query)
        res.json(entry);
    } catch (err) {
        res.json({
            message: err
        })
    }
})

router.get('/current-entry', async (req, res) => {
    try {
        let entry
        entry = await Entry.findOne({}).sort({"entryDate": -1}).limit(1)
        res.json(entry);
    } catch (err) {
        res.json({
            message: err
        })
    }
})

// Post Entry
router.post('/entry', async (req, res) => {
    console.log("req post masuk")
    let current_entry
    try {
        current_entry = await Entry.find({
            entryDate: { "$gte": today, "$lt": tom }
        });
    } catch (err) {
        current_entry = null
    }

    if (current_entry == null) {
        const entry = new Entry({
            custName: req.body.cust_name,
            entryNo: 1,
            entryStatus: "new-entry",
            entryDate : new Date().toLocaleString()
        })

        try {
            console.log(Date.now)
            const savedEntry = await entry.save()
            res.json(savedEntry)
        } catch (err) {
            res.json({
                message: err
            })
        }
    } else {
        const entry = new Entry({
            custName: req.body.cust_name,
            entryNo: current_entry.length + 1,
            entryStatus: "new-entry",
            entryDate : new Date().toLocaleString()
        })

        try {
            console.log(Date.now)
            const savedEntry = await entry.save()
            res.json(savedEntry)
        } catch (err) {
            res.json({
                message: err
            })
        }
    }
})

// Change Entry Status
// entry status is on work
router.put('/entry-work/:entryID', async (req, res) => {
    console.log("set entry to work called")
    try {
        const updatedEntry = await Entry.updateOne({
            _id: req.params.entryID
        }, {
            $set: {
                entryStatus: "on-work"
            }
        })
        res.json(updatedEntry)
    } catch (err) {
        res.json({
            message: err
        });
    }
})

// entry status is done
router.put('/entry-done/:entryID', async (req, res) => {
    try {
        const updatedEntry = await Entry.updateOne({
            _id: req.params.entryID
        }, {
            $set: {
                entryStatus: "done"
            }
        })
        res.json(updatedEntry)
    } catch (err) {
        res.json({
            message: err
        });
    }
})

module.exports = router;