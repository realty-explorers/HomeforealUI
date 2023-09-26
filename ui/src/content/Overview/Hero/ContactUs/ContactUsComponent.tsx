import ContactForm from "./ContactForm";
import styles from '../LandingPage.module.scss'

export default function ContactUsComponent() {
    return (
        <div id="contactUs" className={`${styles.contactsUsSection}`}>
            <div className="m-8 flex justify-between justify-center">
                <div className="flex flex-col w-[55%] items-center justify-center">
                    <div className={styles.contactUsTitle}>Contact Us.</div>
                    <div className="flex flex-col">
                        <div className={styles.contactUsSubtitle}>Pop in your detail and an expert will get</div>
                        <div className={styles.contactUsSubtitle}>back to you as soon as possible to</div>
                        <div className={styles.contactUsSubtitle}>schedule a meeting</div>
                    </div>
                </div>
                <div className="w-[45%] flex flex-col items-center">
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
