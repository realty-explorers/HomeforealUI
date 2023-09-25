import React from 'react'
import styles from '../LandingPage.module.scss'

interface ParagraphProps {
    paragraph: string
}

export default function Paragraph({ paragraph }: ParagraphProps) {
    return (
        <>
            <p className={styles.paragraph}>{paragraph}</p>
        </>
    )
}
