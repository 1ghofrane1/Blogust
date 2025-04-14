import React from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Auth from '../auth/Auth';
import ThemeToggle from '../themeToggle/ThemeToggle';

const Navbar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.social}>
                <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
                <Image src="/instagram1.png" alt="Instagram" width={24} height={24} />
                <Image src="/youtube.png" alt="Youtube" width={24} height={24} />
            </div>
            <div className={styles.logo}>Blogust</div>
            <div className={styles.links}>
                <ThemeToggle/>
                <Link href="/" className={styles.link}>Home</Link>
                <Link href="/about" className={styles.link}>About</Link>
                
                <Auth/>
            </div>
        </div>
    )
}

export default Navbar;