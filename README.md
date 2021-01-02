# 531workout-serverless

Generates workouts for the 5/3/1 Weightlifting program

[View App](https://workout.taco.fyi)

![screenshot](https://github.com/kianga722/531workout/blob/master/screenshot.png)

## Summary

- Same as [531workout](https://github.com/kianga722/531workout) but now using Netlify serverless functions (to stop relying on Heroku dyno which needs to wake up)
- Used serverless-http package to wrap Express API for serverless use (instead of trying to re-write everything)
- Needed to add public/\_redirects file for React Router to work
- Updated Nodemailer call async await syntax to send properly
