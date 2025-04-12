"use client"

import React, { useState } from 'react';
import styles from './auth.module.css';
import Link from 'next/link';


const Auth = () => {
    
    const [open, setOpen] = useState(false);
    //temporary
    const status="notauthenticated"
    return (
        <>
        {status==="notauthenticated" ? (
            <Link href="/login" className={styles.links}>Login</Link>
            ) : (
                <>
                <Link href="/write">Write</Link>
                <span>Logout</span>
                </>
            )}
            <div className={styles.burger} onClick={() => setOpen(!open)}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
                {open && (
                    <div className={styles.responsiveMenu}>
                        <Link href="/" >Home</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                        {status==="notauthenticated" ? (
                            <Link href="/login" className={styles.link}>Login</Link>) : 
                                (
                                    <>
                                    <Link href="/write" className={styles.link}>Write</Link>
                                    <span className={styles.link}>Logout</span>
                                    </>
                                )
                        }
                    </div>
        )   }
       
        
        </>
    )
}

export default Auth;