import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './categoryList.module.css';

const CategoryList = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Populaaar Categoriez</h1>
            <div className={styles.categories}>
            <Link href="/blog?cat=style" className={`${styles.category} ${styles.lifestyle}`} >
                    <Image src="/lifestyle.jpg" alt="Style" width={32} height={32} className={styles.image}/>
                    Lifestyle
                </Link>
                <Link href="/blog" className={`${styles.category} ${styles.food}`}>
                    <Image src="/food.jpg" alt="Style" width={32} height={32} className={styles.image} />
                    Food
                </Link>
                <Link href="/blog" className={`${styles.category} ${styles.culture}`}>
                    <Image src="/culture.jpg" alt="Style" width={32} height={32} className={styles.image} />
                    Culture
                </Link>
                <Link href="/blog" className={`${styles.category} ${styles.coding}`}>
                    <Image src="/coding.jpg" alt="Style" width={32} height={32} className={styles.image} />
                    Coding
                </Link>
                <Link href="/blog" className={`${styles.category} ${styles.travel}`}>
                    <Image src="/travel.jpg" alt="Style" width={32} height={32} className={styles.image} />
                    Travel
                </Link>
                <Link href="/blog" className={`${styles.category} ${styles.fashion}`}>
                    <Image src="/Fashion.jpg" alt="Style" width={32} height={32} className={styles.image} />
                    Fashion
                </Link>
            </div>
        </div>
    );
};
export default CategoryList;