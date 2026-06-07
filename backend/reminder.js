const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Todo = require("./models/Todo");

require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify((error) => {

    if (error) {
        console.log("Email Error:", error);
    } else {
        console.log("Email Server Ready");
    }

});

console.log("Reminder Service Started");


// ================= SEND REMINDER =================

async function sendReminder(todo, subject) {

    await transporter.sendMail({

        from: process.env.EMAIL,

        to: todo.userEmail,

        subject: subject,

        html: `

            <h2>${subject}</h2>

            <p>
                Task:
                <b>${todo.task}</b>
            </p>

            <p>
                Deadline:
                ${new Date(todo.deadline)
                .toLocaleString("en-IN")}
            </p>

        `
    });

    console.log(
        "Reminder Sent:",
        subject,
        todo.userEmail
    );
}


// ================= CRON =================

cron.schedule("* * * * *", async () => {

    try {

        const now = new Date();

        const todos = await Todo.find({
            completed: false
        });

        for (const todo of todos) {

            const due =
                new Date(todo.deadline);

            const diff =
                due - now;

            // 24 Hours

            if (
                diff <= 24 * 60 * 60 * 1000 &&
                diff > 23 * 60 * 60 * 1000 &&
                !todo.reminder24Sent
            ) {

                await sendReminder(
                    todo,
                    "⏰ Due Tomorrow"
                );

                todo.reminder24Sent = true;

                await todo.save();
            }

            // 3 Hours

            if (
                diff <= 3 * 60 * 60 * 1000 &&
                diff > 2.9 * 60 * 60 * 1000 &&
                !todo.reminder3Sent
            ) {

                await sendReminder(
                    todo,
                    "⏰ Due In 3 Hours"
                );

                todo.reminder3Sent = true;

                await todo.save();
            }

            // 15 Minutes

            if (
                diff <= 15 * 60 * 1000 &&
                diff > 14 * 60 * 1000 &&
                !todo.reminder15Sent
            ) {

                await sendReminder(
                    todo,
                    "🚨 Due In 15 Minutes"
                );

                todo.reminder15Sent = true;

                await todo.save();
            }
        }

    } catch (error) {

        console.log(error);

    }

});