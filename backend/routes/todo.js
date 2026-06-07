const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();


router.get("/test", (req, res) => {
    res.send("Todo Route Working");
});

router.post("/add", async (req, res) => {

    try {

        const {
            userEmail,
            task,
            deadline
        } = req.body;

        const todo = new Todo({
            userEmail,
            task,
            deadline
        });

        await todo.save();

        res.status(201).json({
            message: "Todo Added Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }

});

// Get Todos by Email

router.get("/:email", async (req, res) => {

    try {

        const todos = await Todo.find({
            userEmail: req.params.email
        });

        res.status(200).json(todos);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }

});

module.exports = router;