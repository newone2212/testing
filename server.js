const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const cors=require("cors")
const DATA_FILE = path.join(__dirname, 'campaigns.json');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
// Load campaigns from file
app.get('/api/campaigns', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            const campaigns = JSON.parse(data);
            res.json(campaigns);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Save campaigns to file
app.post('/api/campaigns', (req, res) => {
    const newCampaign = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let campaigns = [];
        try {
            campaigns = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        newCampaign.id = campaigns.length ? campaigns[campaigns.length - 1].id + 1 : 1;
        campaigns.push(newCampaign);

        fs.writeFile(DATA_FILE, JSON.stringify(campaigns, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.send('Campaigns saved successfully');
        });
    });
});
// Update a specific campaign by name
app.post('/api/updateCampaign', (req, res) => {
    const { campaignName, influencer } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let campaigns = [];
        try {
            campaigns = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        let campaignFound = false;
        for (let campaignList of campaigns) {
            for (let campaign of campaignList) {
                if (campaign.name.toLowerCase() === campaignName.toLowerCase()) {
                    campaign.influencers.push(influencer);
                    campaignFound = true;
                    break;
                }
            }
        }

        if (!campaignFound) {
            return res.status(404).send('Campaign not found.');
        }

        fs.writeFile(DATA_FILE, JSON.stringify(campaigns, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.send('Campaign updated successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
