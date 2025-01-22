const express = require("express");
const { Transaction } = require("../Model/Transactions");
const Router = express.Router();
const AuthMiddleware = require("../MiddleWare/AuthMiddleware");

Router.get("/",  async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user');
        return res.send(transactions);
    } catch (err) {
        return res.status(500).send(err.message || "Something went wrong.");
    }
}
);
Router.get("/report", async (req, res) => {
    try {
        
        const transactions = await Transaction.find();
      
        

       
        const totalsByMonth = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
        };

        
        let thisMonthTotal = 0;
        let thisMonthCustomerTotal = 0;

      
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); 

        
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        transactions.forEach((transaction) => {
            const transactionDate = new Date(transaction.transactionDate); 
            const year = transactionDate.getFullYear();
            const month = transactionDate.getMonth();

            
            if (year === currentYear) {
                
                const monthName = monthNames[month];
                totalsByMonth[monthName] += transaction.amount;

               if (month === currentMonth) {
                    thisMonthCustomerTotal += 1;
                    thisMonthTotal += transaction.amount;
                }
            }
        });

       
        return res.status(200).json({ totalsByMonth, thisMonthTotal, thisMonthCustomerTotal });
    } catch (err) {
      
        return res.status(500).json({ error: err.message || "Something went wrong." });
    }
});



module.exports = Router;