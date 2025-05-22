import { Button, Modal, Box, TextField } from "@mui/material";
import { useEffect, useRef, useState, FormEvent } from "react";
// @ts-ignore
import styles from '../styles/home.module.css';
import Hamburger from 'hamburger-react';
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { useNavigate } from "react-router-dom";

const PACKAGE_ID = import.meta.env.PACKAGE_ID;
const MODULE_NAME = "farmvest";
const IDEA_TABLE_ID = import.meta.env.IDEA_TABLE_ID;

export default function Navbar() {
    const clickRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [openInvestModal, setOpenInvestModal] = useState<boolean>(false);

    const [investTitle, setInvestTitle] = useState<string>("");
    const [investAmount, setInvestAmount] = useState<string>("");
    const [investBalance, setInvestBalance] = useState<string>("");

    // @ts-ignore
    const { mutate: signAndExecuteTransactionInvest, isLoading: isInvesting } = useSignAndExecuteTransaction();
    const account = useCurrentAccount();

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // @ts-ignore
            if (clickRef.current && !clickRef.current.contains(event.target as node)) {
                setIsMenuOpen(!isMenuOpen);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleInvest = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::invest`,
            arguments: [
                // @ts-ignore
                tx.object(IDEA_TABLE_ID),
                tx.pure.string(investTitle),
                tx.pure.u64(Number(investAmount)),
                tx.pure.u64(Number(investBalance)),
            ],
        });
        tx.setGasBudget(10000000);

        signAndExecuteTransactionInvest(
            { transaction: tx },
            {
                onSuccess: (result: any) => {
                    alert("Investment made! Transaction digest: " + result.digest);
                    setOpenInvestModal(false);
                },
                onError: (err: any) => {
                    alert("Failed to invest: " + err.message);
                },
            }
        );
    };

    const investModalBody = (
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <form onSubmit={handleInvest}>
                <TextField
                    label="Title"
                    value={investTitle}
                    onChange={e => setInvestTitle(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Amount"
                    value={investAmount}
                    onChange={e => setInvestAmount(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <TextField
                    label="Balance"
                    value={investBalance}
                    onChange={e => setInvestBalance(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" disabled={isInvesting}>
                    {isInvesting ? "Investing..." : "Invest"}
                </Button>
            </form>
        </Box>
    );

    return (
        <div className={'flex justify-between w-[100vw] px-[10px] h-[70px]'}>
            <p className={'text-nowrap text-[25px] font-[820] text-green-700'} style={{ textTransform: 'none' }}>
                GreenChain
            </p>
            <div className={'hidden md:flex md:gap-[15px]'}>
                <ul className={styles.lists}>
                    <li>about us</li>
                    <li>services</li>
                    <li>Resources</li>
                    <li>Contact us</li>
                </ul>
                <div>
                    <Button variant='outlined' className={''} onClick={() => setOpenInvestModal(true)}>
                        Invest now
                    </Button>
                    <Button variant='contained' className={'text-nowrap'} onClick={() => navigate("/login")}>
                        Sign In
                    </Button>
                </div>
            </div>
            <section className={'flex flex-col md:hidden'}>
                <Hamburger toggled={isMenuOpen} toggle={setIsMenuOpen} />
                {isMenuOpen && (
                    <div
                        className={`${styles.hamburgerMenu} ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                        ref={clickRef}
                    >
                        <li>about us</li>
                        <li>services</li>
                        <li>Resources</li>
                        <li>Contact us</li>
                        <Button variant='outlined' className={''} onClick={() => setOpenInvestModal(true)}>
                            Invest now
                        </Button>
                        <Button variant='contained' className={'text-nowrap'} onClick={() => navigate("/login")}>
                            Sign In
                        </Button>
                    </div>
                )}
            </section>
            <Modal open={openInvestModal} onClose={() => setOpenInvestModal(false)}>
                {investModalBody}
            </Modal>
        </div>
    );
}