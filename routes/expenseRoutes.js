const express = require("express");
const Expense = require("../models/ExpenseModel");

const auth = require("../middlewares/auth");


const router = express.Router();

const addExpense = async (req, res) => {
    const { title, description, date, amount } = req.body;

    let errors = {};
    //validation

    if (title.trim().length === 0) {
        errors.title = "Title should not be empty";
    }

    if (date.trim().length === 0) {
        errors.date = "Date should not be empty";
    }

    if (amount.toString().trim().length === 0 || amount === 0) {
        errors.amount = "amount should not be empty";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    const user = res.locals.user;

    //add expense

    const expenseObj = new Expense({ 
        title,
        description,
        date,
        amount,
        userId: user._id,
        createdAt: new Date().toISOString()
    });

    try {
        const savedExpense = await expenseObj.save(expenseObj);

        return res.status(201).json(savedExpense);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }

}

const getExpensesBasedOnUser = async (req, res) => {
    const user = res.locals.user;

    try {
        const expenses = await Expense.find({ userId: user._id });
        res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong." });
    }
}

const updateExpense = async (req, res) => {
    const { id, title, description, date, amount } = req.body;

    let errors = {};
    //validation

    if (id.trim().length === 0) {
        errors.id = "id should not be empty";
    }

    if (title.trim().length === 0) {
        errors.title = "Title should not be empty";
    }

    if (date.trim().length === 0) {
        errors.date = "Date should not be empty";
    }

    if (amount.toString().trim().length === 0 || amount === 0) {
        errors.amount = "amount should not be empty";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    try {
        const user = res.locals.user;
        const expense = await Expense.findOne({ _id: id });
        if (!expense) {
            return res.status(400).json({ error: "Expense not found" });
        }
        console.log(`${expense.userId}   ${user._id}`);
        if (expense.userId.toString() !== user._id.toString()) {
            console.log("hi");
            return res.status(401).json({ error: "You are not allowed to perform this operation" });
        }
        expense.title = title;
        expense.description = description;
        expense.date = date;
        expense.amount = amount;
        const savedExpense = await expense.save();
        return res.status(200).json(savedExpense);

    } catch(error) {
        console.log(error);
        return res.status(400).json({ error: "Something went wrong" });
    }
}

const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const user = res.locals.user;
        const expense = await Expense.findOne({ _id: id });
        if (expense.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ error: "You are not allowed to perform this operation" });
        }
        const deleted = await expense.delete();
        return res.status(200).json(deleted);
    } catch(error) {
        console.log(error);
        return res.status(400).json({ error: "Something went wrong" });
    }
    
}

router.post("/add", auth, addExpense);
router.get("", auth, getExpensesBasedOnUser)
router.put("/update", auth, updateExpense);
router.delete("/delete/:id", auth, deleteExpense);

module.exports = router;