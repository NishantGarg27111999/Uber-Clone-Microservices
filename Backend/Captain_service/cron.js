const cron = require('node-cron');
const Captain = require('./models/captain.model'); // adjust path as needed

// Run every day at midnight (12:00 AM)
cron.schedule('0 0 * * *', async () => {
    try {
        console.log("Resetting captain stats at midnight...");

        await Captain.updateMany({}, {
            $set: {
                moneyEarned: 0,
                ridesToday: 0,
                distanceCoveredToday:0
            }
        });

        console.log("Captain stats reset successfully.");
    } catch (error) {
        console.error("Error resetting captain stats:", error);
    }
});
