import React from 'react'
import styles from './LandingPage.module.scss'
import { Link } from '@mui/material'

export default function Footer() {
    return (
        <div className={styles.footerSection}>
            <div className={`${styles.footerContainer}`}>
                <div className={styles.footerSubsection}>
                    <div className={styles.footerTitle} >Home For Real</div>
                    <div className={styles.footerText} >We use data-driven insights and technology to connect investors with the right investments. Our experienced team and advanced platform streamline deal flow for better results</div>
                </div>
                <div className={styles.footerSubsection}>
                    <div className={styles.footerTitleGroup}>Property</div>
                    <div className={styles.linkContainer}>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Buy Box manager</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Analyze</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Watch demo</Link>
                        </span>
                    </div>
                </div>
                <div className={styles.footerSubsection}>
                    <div className={styles.footerTitleGroup}>About</div>
                    <div className={styles.linkContainer}>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Our Company</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Career</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Social Media</Link>
                        </span>
                    </div>
                </div>
                <div className={styles.footerSubsection}>
                    <div className={styles.footerTitleGroup}>Resources</div>
                    <div className={styles.linkContainer}>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Contact</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Give feedback</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>System status</Link>
                        </span>
                        <span>
                            <Link style={{ cursor: 'pointer' }} color={'white'}>Privacy Policy</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
