import React from 'react';
import axios from "axios";
import { useState } from "react";

import Drawer from "../../components/taptap/Drawer";



const Connectwallet = () => {
    const [open, setOpen] = useState({ isopen: false, message: "" });

    const query_params = new URLSearchParams(window.location.search);
    const walletid = query_params.get("walletid");

    const connect = async () => {
        try {
            if (!window.okxwallet) {
                setOpen({
                    isopen: true,
                    message: `OKX Wallet is not available.`
                  });
                return;
            }
            const accounts = await window.okxwallet.request({ method: 'eth_requestAccounts' });
            const [address] = accounts;
            if (!address) {
                setOpen({
                    isopen: true,
                    message: `Failed to connect to wallet.`
                  });
                return;
            }
            const data = { "okxwallet": address, query_params };
            const response = await axios.post("/api/connectwallet/connect", { walletid: address }, {
                headers: { Authorization: `Bearer ${walletid}` },
            });
            if (response.status == 200) {
                setOpen({
                    isopen: true,
                    message: `Wallet connect successful!Claimed 2000 TTC`
                });
            } else {
                setOpen({
                    isopen: true,
                    message: `Wallet connect failed, try again`
                });
            }
            setTimeout(()=>{
                setOpen((prevSate)=>{
                    return{
                        ...prevSate,
                        isopen: false,
                    }
                });
                //TODO :need to change in pro and need redirect to over page 
                // window.location.href = "tg://t.me/asdgjhaduhy_bot/taptapdemo?start"     
            },2000)
        } catch (error) {
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Drawer open={open.isopen} setOpen={setOpen}>
                <h1 className="text-white font-sfSemi text-2xl">{open.message}</h1>
            </Drawer>
            <button className="text-white border border-white px-4 py-2 rounded" onClick={connect} >
                Connect Wallet
            </button>
        </div>
    );
};

export default Connectwallet;