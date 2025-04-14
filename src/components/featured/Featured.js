import React from 'react';
import styles from './featured.module.css';
import Image from 'next/image';

const Featured = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <b>Welcome to the Featured Section!</b>
            </h1>
            <div className={styles.post}>
                <div className={styles.imgContainer}>
                    <Image src="/ls.jpg" alt="imaaaaaage" fill className={styles.image}/>
                </div>
                <div className={styles.textContainer}>
                    <h1 className={styles.postTitle}>Lorem ipsum dolor sit amet.</h1>
                    <p className={styles.postDesc}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.
                    </p>
                    <button className={styles.button}>Read More</button>
                </div>
            </div>
        </div>
    )
} 

export default Featured;