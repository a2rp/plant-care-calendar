import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import BackToTop from "./components/backToTop";
import PlantCareCalendar from "./components/plantCareCalendar";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className={styles["app-shell"]} id="top">
            <SiteHeader
                title="Little Green"
                mark="L"
                navItems={[["My plants", "#workspace"], ["Add a plant", "#add"]]}
                repoUrl="https://github.com/a2rp/plant-care-calendar"
            />
            <main className={styles.pageContent}>
                <PlantCareCalendar />
            </main>
            <SiteFooter repoUrl="https://github.com/a2rp/plant-care-calendar" />
            <BackToTop visible={showBackToTop} />
        </div>
    );
};

export default App;