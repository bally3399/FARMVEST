import google_play from '../assets/Google Play logo.svg';
import {Button} from "@mui/material";
import AppleIcon from '@mui/icons-material/Apple';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import tiktok from '../assets/Vector (2).svg';
import styles from '../styles/home.module.css'
import {useState} from "react";

export default function Footer(){
    const[email, setEmail] = useState('');
    const handleSubscribe= ()=>{
        if(email){
            setEmail('');
        }
    }
    return (
        <div className={'bg-[#F7E4D6] py-[30px] w-[100vw] px-[20px] md:px-[10%]'}>
            <div className={'flex flex-col md:justify-between md:flex-row w-[100%]'}>
                <div>
                    <p className={'text-[15px] font-[700] pb-[15px]'}>Sign up for our newsletter</p>
                    <form onSubmit={handleSubscribe} className={'flex flex-col md:flex-row gap-[10px] md:gap-[40px]'}>
                        <input placeholder={'email@gmail.com'} type='email' className={'w-[60vw] sm:w-[250px] p-[7px_10px] rounded-md bg-none'}
                               onChange={(e) => {setEmail(e.target.value)}}/>
                        <Button variant='contained' type={'submit'} className={'h-[35px] w-[120px]'} disabled={!email}>subscribe</Button>
                    </form>
                    <p className={'text-[12px] py-[5px]'}>Get the app</p>
                    <div className={'flex gap-[20px]'}>
                        <button className={` gap-[7px] ${styles.button}`}>
                            <div>
                                <img src={google_play} alt=""/>
                            </div>
                            <div className={styles.store}>
                                <p>Get it on</p>
                                <p className={'text-[10px] font-[750] capitalize'}>google store</p>
                            </div>
                        </button>
                        <button className={`${styles.button}`}>
                            <div>
                                <AppleIcon sx={{color:'#1a1a1a'}}/>
                            </div>
                            <section className={styles.store}>
                                <p>Get it on</p>
                                <p className={'text-[10px] font-[750] capitalize'}>App store</p>
                            </section>
                        </button>
                    </div>
                </div>
                <div className={styles.companyList}>
                    <section className={styles.company}>
                        <p>Company</p>
                        <li>about us</li>
                        <li>services</li>
                        <li>Resources</li>
                        <li>contact</li>
                    </section>
                    <section className={styles.company}>
                        <p>legal</p>
                        <li>Terms & conditions</li>
                        <li>Privacy policy</li>
                    </section>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p className={'text-[12px] pb-[7px] text-nowrap'}>&copy; 2023, GreenChain All Rights Reserved.</p>
                <div className={styles.footerIcons}>
                    <div>
                        <InstagramIcon/>
                    </div>
                    <div>
                        <XIcon/>
                    </div>
                    <div >
                        <img src={tiktok} alt="" className={'object-center object-contain'}/>
                    </div>
                    <div>
                        <YouTubeIcon/>
                    </div>
                </div>
            </div>
        </div>
    )
}