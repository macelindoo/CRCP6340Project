import nodemailer from "nodemailer";

export async function sendMessage(sub, txt) {
//const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  requireTLS: process.env.MAIL_TLS === 'true',
    });

    let message = {
        from: process.env.MESSAGE_FROM,
        to: process.env.MESSAGE_TO,
        subject: sub,
        text: txt,
    };

   try {
    await transporter.sendMail(message);
    console.log("Message sent");
  } catch (err) {
    console.error("Message not sent - " + err);
    throw err;
  }
}

//HELPER FUNCTION TO PICK A DAILY FEATURED PROJECT
//Takes an array of projects and returns one based on the current date
//So it changes daily but is the same for everyone on a given day
  export function getDailyFeaturedProjectId(projects) {
    //Get today's date as YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);
    //Create a hash from the date string
    let hash = 0;
    for(let i = 0; i<today.length; i++) {
      hash += today.charCodeAt(i);
    }
    //Pick a project based on the hash
    let index = hash % projects.length;
    return projects[index].id;
  }

