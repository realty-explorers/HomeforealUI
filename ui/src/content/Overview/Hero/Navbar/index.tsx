import React from 'react'
import HoopoeLogo from '@/public/static/images/logo/Hoopoe-Logo.svg'
import NavBarComponent from './NavBarComponent'
import styles from '../LandingPage.module.scss'
import { Button } from "@mui/material";

function Banner() {
    return (
        <div className=' mt-4 mb-3 min-w-[85%] flex justify-between'>
            <img src={HoopoeLogo} alt="logo" />
            <div className='min-w-[58%] flex justify-between items-center'>
                <div className='w-[52%]'>
                    <NavBarComponent />
                </div>
                <div className='w-[48%] flex justify-end'>
                    <div className='flex justify-end items-center'>
                        <a href="#" className={`mt-4 text-base mr-3 ${styles.navFont}`}>
                            <b>Sign Up</b>
                        </a>
                        <Button className={`${styles.getStarted} mt-4`}>
                            <div className={styles.getStartedTitle}>
                                Get Started
                            </div>
                        </Button>
                    </div>
                    <div></div>
                </div>
            </div>

        </div>
    )
}

export default Banner