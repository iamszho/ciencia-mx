import { useState } from "react";

export default function MainNavToggleButton({ onToggle }: { onToggle: () => void }) {
    const [open, setOpen] = useState(false);
    return (
        <button className={`${open ? 'open' : 'closed'} main-nav__toggle`} onClick={() => { setOpen(!open); onToggle(); }}>
            {open ? 'X' : '☰'}
        </button>
    );
}