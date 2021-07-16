const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    },
    date: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    userId: {
        type: String
    }
});


const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;