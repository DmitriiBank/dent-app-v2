import { useEffect, useState } from "react";
import "./CookieBanner.style.css";

export const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("cookiesAccepted");
        if (!accepted) setVisible(true);
    }, []);

    const acceptCookies = () => {
        document.cookie = "cookiesAccepted=true; path=/; max-age=31536000";
        localStorage.setItem("cookiesAccepted", "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-overlay">
            <div className="cookie-box">
                <h3 className="cookie-title">Для прохождения тестов необходимо ваше согласие на принятие cookies😽</h3>
                <p className="cookie-text">
                    Мы используем cookies, чтобы всё работало быстро и плавно
                </p>

                <button className="cookie-btn" onClick={acceptCookies}>
                    Принять
                </button>
            </div>
        </div>
    );
};