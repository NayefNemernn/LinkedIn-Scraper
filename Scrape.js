const puppeteer = require('puppeteer');// import puppeteer
const fs = require('fs'); // file system 
async function scrapeJobs(searchQuery) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const searchURL = `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(searchQuery)}`;
    await page.goto(searchURL, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.jobs-search__results-list');

    const jobs = await page.evaluate(() => {
        const jobNodes = document.querySelectorAll('.jobs-search__results-list li');
        const jobList = [];

        jobNodes.forEach(job => {
            const jobTitle = job.querySelector('.base-search-card__title')?.innerText || '';
            const companyName = job.querySelector('.base-search-card__subtitle')?.innerText || '';
            const jobLocation = job.querySelector('.job-search-card__location')?.innerText || '';
            const jobDescription = job.querySelector('jobs-description__container.jobs-description__container--condensed')?.innerText || '';
            const jobPostDate = job.querySelector('.job-search-card__listdate')?.innerText || '';
            const skillsNeeded = ''; // This is not available on the job card, requires navigating to job details page
            const applicationLink = job.querySelector('a.base-card__full-link')?.href || '';

            jobList.push({
                jobTitle,
                companyName,
                jobLocation,
                jobDescription,
                jobPostDate,
                skillsNeeded,
                applicationLink
            });
        });

        return jobList;
    });

    await browser.close();

    fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2));
}