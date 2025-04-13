import React from 'react';
import styles from './card.module.css';
import Link from 'next/link';
import Image from 'next/image';

const Card = () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image src="/ts.jpg" alt='' fill className={styles.image}/>
            </div>
            <div className={styles.textContainer}>
                <div className={styles.detail}>
                    <span className={styles.date}>15.03.2025</span>
                    <span className={styles.category}> CULTURE</span>
                </div>
                <Link href="/">
                    <h1>testetstestetse</h1>
                </Link>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, cumque?</p>
                <Link href="/" className={styles.link}>Read More</Link>
            </div>
        </div>
    )
}

export default Card;