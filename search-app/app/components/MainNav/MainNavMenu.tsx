import Link from "next/link";
import "./main-nav.css"
import { FaRegQuestionCircle } from "react-icons/fa";


export default function MainNavMenu({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) {
    return (
        <ul className={`main-nav__list ${isOpen ? 'active' : ''}`}>
            <li className="main-nav__item"><Link className="main-nav__link" href="/acerca-del-proyecto" onClick={onClick}>Acerca de</Link></li>
            <li className="main-nav__item"><Link className="main-nav__link" href="/plan-de-trabajo" onClick={onClick}>Plan de Trabajo</Link></li>
            <li className="main-nav__item"><Link className="main-nav__link" href="/informacion-tecnica" onClick={onClick}>Bibliotecarios</Link></li>
            <li className="main-nav__item"><Link className="main-nav__link" href="/" onClick={onClick}>Acervo</Link></li>
            <li className="main-nav__item"><Link className="main-nav__link" href="https://cienciaabierta.mx/#contacto" aria-label="Contacto" onClick={onClick}>Contacto</Link></li>
            <li className="main-nav__item"><Link className="main-nav__link link-help" href="/preguntas-frecuentes" aria-label="Preguntas Frecuentes" onClick={onClick}><FaRegQuestionCircle /></Link></li>
        </ul>
    );
}
