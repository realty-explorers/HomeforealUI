import styles from "../LandingPage.module.scss";
import { Typography } from "@mui/material";
import ThemedButtonLg from "@/components/Buttons/ThemedButtonLg";
import { useState } from "react";
import Paragraph from "./Paragraph";


const agentParagraph = 'Expand your client base and close more deals with our data-driven platform.'
const fundsParagraph = 'Our patented screener finds investments aligned with your fund strategies.'
const investorParagraph = 'Gain access to expert-vetted investments personalized to your criteria.'

const LearnMoreSection = () => {
    const [paragraph, setParagraph] = useState<string>(agentParagraph)

    return (
        <div className={styles.LearnMoreSection}>
            <Typography className={styles.LearnMoreSectionTitle}>
                Build deal flow manager <b>designed for your customer</b>
            </Typography>
            <div className="container mx-auto flex justify-around">
                <div className={`${styles.learnMoreLabels} ${paragraph === agentParagraph && styles.currentLabel}`} onClick={() => setParagraph(agentParagraph)}>For Agents</div>
                <div className={`${styles.learnMoreLabels} ${paragraph === fundsParagraph && styles.currentLabel}`} onClick={() => setParagraph(fundsParagraph)}>For Funds</div>
                <div className={`${styles.learnMoreLabels} ${paragraph === investorParagraph && styles.currentLabel}`} onClick={() => setParagraph(investorParagraph)}>For Investors</div>
            </div>
            <div>
                <Paragraph paragraph={paragraph} />
            </div>
            <div className={styles.learnMoreBtnDiv}>
                <ThemedButtonLg text="Learn More" />
            </div>
        </div>


    )
}
export default LearnMoreSection;
