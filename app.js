// Required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// Create the express server
const app = express();

// Set the server port
const PORT = process.env.PORT || 3000;

// Set the view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Needed to parse HTML data for POST request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoUrl = req.body.videoURL;

    if (videoUrl === undefined || videoUrl === "" || videoUrl === null) {
        return res.render("index", {success: false, error_message: "Please enter a valid URL"});
    } else {
        // Gets the video ID from the URL
        let videoId = videoUrl.split("v=")[1];
        while (videoId.includes("&")) {
            videoId = videoId.split("&")[0];
        }

        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();
        if (fetchResponse.status === "ok") {
            return res.render("index", {success: true, song_title: fetchResponse.title, song_link: fetchResponse.link});
        } else {
            return res.render("index", {success: false, error_message: fetchResponse.error});
        }
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
