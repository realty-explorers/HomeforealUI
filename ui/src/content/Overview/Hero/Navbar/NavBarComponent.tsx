import React from 'react'
import styles from '../LandingPage.module.scss'

function NavBarComponent() {
  return (
    <div>
      <nav>
        <div className='flex justify-evenly'>
          <a href="#" className={`mt-4 text-base mr-6 ${styles.navFont}`}>
            HOME
          </a>
          <a href="#" className={`mt-4 text-base mr-6 ${styles.navFont}`}>
            PRODUCTS
          </a>
          <a href="#" className={`mt-4 text-base mr-6 ${styles.navFont}`}>
            ABOUT
          </a>
          <a href="#" className={`block mt-4 text-base ${styles.navFont}`}>
            CONTACT
          </a>
        </div>

      </nav>
    </div>
  )
}

export default NavBarComponent