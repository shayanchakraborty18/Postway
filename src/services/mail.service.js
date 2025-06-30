import nodemailer from "nodemailer";
import {ApplicationError} from "../error-handler/applicationError.js";

class MailService {

	#transporter;

	constructor() {
		this.#transporter = this.mailConfig();
	}

	mailConfig() {
		return nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: process.env.SENDER_USERNAME,
				pass: process.env.SENDER_PASSWORD,
			},
		});
	}

	async sendMail(fromEmail = "info@abc.com", toEmail, subject = "Welcome to Postway Social Media", content) {
		const mailOptions = {
			from: fromEmail,
			to: toEmail,
			subject: subject,
			text: content,
		};

		try {
			return await this.#transporter.sendMail(mailOptions);
		} catch (err) {
			console.log("email failed to send", err);
			throw new ApplicationError("Error for sending mail", 500);
		}
	}
}

export default new MailService();