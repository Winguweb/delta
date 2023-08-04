import { useEffect, useState } from "react";

const useWelcome = (onClick?: boolean) => {

    const [welcome, setWelcome] = useState(false);

    useEffect(() => {
        const isClient = typeof window !== "undefined";

        if (!isClient || !welcome) {
            return
        }

        if (onClick) {

            localStorage.setItem("welcome", "true");
            setWelcome(false);
        }

        const timer = setTimeout(() => {
            localStorage.setItem("welcome", "true");
            setWelcome(false);
        }, 10000);
        return () => clearTimeout(timer);


    }, [welcome, onClick]);

    useEffect(() => {
        const previoslyShowWelcome = localStorage.getItem('welcome') === 'true'

        setWelcome(!previoslyShowWelcome)

    }, [])

    return welcome;
};

export { useWelcome };
