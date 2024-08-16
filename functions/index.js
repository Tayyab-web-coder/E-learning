const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

exports.sendCourseUpdateEmail = functions.firestore
    .document("courses/{courseId}")
    .onUpdate((change, context) => {
      const course = change.after.data();
      const mailOptions = {
        from: "your-email@gmail.com",
        to: "user-email@example.com",
        subject: "Course Update",
        text: `The course ${course.name} has been updated. Check out the new ` +
          `details!`,
      };

      return transporter.sendMail(mailOptions)
          .then(() => console.log("Email sent"))
          .catch((error) => console.error("Error sending email:", error));
    });
