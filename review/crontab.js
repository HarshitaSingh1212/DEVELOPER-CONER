
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get("/", (req, res) => {
    res.render('crontab.ejs');
});

app.post('/sendEmail', (req, res) => {
    // Define the cron job command to schedule email sending every minute
    const cronJobCommand = 'echo "* * * * * /usr/bin/node /home/ad.rapidops.com/harshita.singh/Downloads/review/email.js" | crontab -';

    // Execute the cron job command
    exec(cronJobCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error adding cron job: ${error}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(`Cron job added successfully: ${stdout}`);
        res.send('Email scheduled successfully');
    });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});