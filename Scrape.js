const puppeteer = require('puppeteer');// import puppeteer
const fs = require('fs'); // file system 
async function scrapeJobs(searchQuery){
    const browser  = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
}