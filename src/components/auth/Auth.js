"use client"
import React, { useState} from 'react';
import styles from './auth.module.css';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";


const Auth = () => {
    
    const [open, setOpen] = useState(false);
    
    const {status}=useSession();
    return (
        <>
        {status==="unauthenticated" ? (
            <Link href="/login" className={styles.link}>Login</Link>
            ) : (
                <>
                <Link href="/write">Write</Link>
                <Link href="/my-blogs">My Blogs</Link>
                <span className={styles.link} onClick={signOut}>
                    Logout
                </span>
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
                        
                        {status==="unauthenticated" ? (
                            <Link href="/login">Login</Link>) : 
                                (
                                    <>
                                    <Link href="/write">Write</Link>
                                    <Link href="/my-blogs">My Blogs</Link>
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