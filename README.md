# Safe Skills Driving School Chapter Hub

This folder contains a browser-based prototype for the Safe Skills Driving School chapter leadership portal and member course area.

## What it includes

- Chapter leader login area
- Executive office admin login area
- Marketing toolkit document library
- Chapter membership upload form
- Admin-created request forms for chapter leaders
- Admin course builder for a timed member course
- Lesson-by-lesson navigation with page timers
- Checkpoint quizzes, final exam, and certificate download
- Course signup records with prototype receipt and email notice logging

## Admin login

- Email: `kim@wingsoverwisconsin.org`
- Password: `testadmin`

## Chapter demo login

- Email: `madison.chapter@wingsoverwisconsin.org`
- Password: `chapterdemo`

## Important prototype note

This is still a front-end prototype. It can be hosted on Tiny.host or another static host, but credentials are stored in the page code, and uploaded files, enrollments, course progress, and notification logs are saved only in the current browser using local storage plus IndexedDB.

## What is simulated right now

- Course purchase signup and receipt logging
- Email notices to you and to the member
- Course progress tracking
- Certificate generation as a downloadable HTML certificate

## What still needs a real backend before going live

- Real payment processing
- Real email delivery
- Real user accounts and secure authentication
- Shared cloud storage and database for all members

## Files

- `index.html`: page structure
- `styles.css`: design and layout
- `app.js`: login logic, uploads, forms, course builder, progress tracking, and local persistence
