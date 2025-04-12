"use client";

import React, { useEffect, useState } from "react";
import "../globals.css";
import { fetchData } from "./dashboard_logics";

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData((result) => {
            setData(result);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <pre>{loading ? "Loading..." : JSON.stringify(data, null, 2)}</pre>
        </>
    );
}
