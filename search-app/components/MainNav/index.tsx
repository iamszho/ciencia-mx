"use client";

import { useState } from "react";
import MainNavMenu from "./MainNavMenu";
import MainNavToggleButton from "./MainNavToggleButton";

export default function MainNav() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="main-nav">
            <MainNavToggleButton onToggle={() => setOpen(!open)} />
            <MainNavMenu isOpen={open} onClick={() => setOpen(false)} />
        </nav>
    );
}