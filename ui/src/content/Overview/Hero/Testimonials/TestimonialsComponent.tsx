import styles from "../LandingPage.module.scss";


export default function TestimonialsComponent() {
    return (
        <div className={styles.testimonialSection}>
            <div className="h-[10%]">
                <img
                    className="w-12 h-12 "
                    src="/static/images/placeholders/illustrations/ball.png"
                />
            </div>
            <div className="flex flex-col items-center h-[30%]">
                <div className={styles.testimonialTitle}>Testimonials.</div>
                <div className={styles.testimonialSubtitle}>This is what our client are saying</div>
            </div>
            <div className="flex items-center h-[60%]">
                <div className='mr-8 flex flex-col '>
                    <div className={styles.testimonialName}>Sarah K.</div>
                    <div className={styles.testimonialPosition}>Fund Manager</div>
                    <div className={styles.testimony}>"This platform has been a game-changer for expanding my client base. The investment matching tools bring new qualified leads every week."</div>
                </div>
                <div className='flex flex-col'>
                    <div className={styles.testimonialName}>Michael R.</div>
                    <div className={styles.testimonialPosition}>GA Agent</div>
                    <div className={styles.testimony}>"The proprietary screener has helped us efficiently identify investment opportunities that fit our hedge fund strategy and risk parameters."</div>
                </div>
                <div className="ml-8 flex flex-col">
                    <div className={styles.testimonialName}>James T.</div>
                    <div className={styles.testimonialPosition}>Investor</div>
                    <div className={styles.testimony}>"As an investor, it's so valuable having a team of experts customize options for me based on my unique investment goals."</div>
                </div>
            </div>
        </div>
    )
}
