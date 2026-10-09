import { useEffect, useMemo, useState } from "react";
import { FiDroplet, FiPlus, FiSun, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog";
import styles from "./styles.module.css";

const storageKey = "little-green-plant-list";
const dateOffset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
};
const starterPlants = [
    { id: 1, name: "Monstera", type: "Monstera deliciosa", room: "Living room", waterEvery: 7, lastWatered: dateOffset(-8), light: "Bright, indirect" },
    { id: 2, name: "Jade plant", type: "Crassula ovata", room: "Kitchen sill", waterEvery: 14, lastWatered: dateOffset(-10), light: "Sunny window" },
    { id: 3, name: "Bird of paradise", type: "Strelitzia", room: "Bedroom", waterEvery: 6, lastWatered: dateOffset(-7), light: "Bright, indirect" },
    { id: 4, name: "Pothos", type: "Epipremnum aureum", room: "Bookshelf", waterEvery: 9, lastWatered: dateOffset(-4), light: "Low to medium" },
];
const readPlants = () => {
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : starterPlants;
    } catch {
        return starterPlants;
    }
};
const daysUntilWater = (plant) => {
    const last = new Date(plant.lastWatered + "T12:00:00");
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return plant.waterEvery - Math.floor((today - last) / 86400000);
};

const PlantCareCalendar = () => {
    const [plants, setPlants] = useState(readPlants);
    const [filter, setFilter] = useState("All plants");
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState({ name: "", type: "", room: "", waterEvery: "7", light: "Bright, indirect" });
    const [pendingDelete, setPendingDelete] = useState(null);
    useEffect(() => localStorage.setItem(storageKey, JSON.stringify(plants)), [plants]);

    const needsWater = plants.filter((plant) => daysUntilWater(plant) <= 0).length;
    const visiblePlants = useMemo(() => plants.filter((plant) => {
        const due = daysUntilWater(plant) <= 0;
        const matchesFilter = filter === "All plants" || (filter === "Needs water" ? due : !due);
        return matchesFilter && (plant.name + " " + plant.type + " " + plant.room).toLowerCase().includes(query.toLowerCase());
    }), [plants, filter, query]);
    const addPlant = (event) => {
        event.preventDefault();
        if (!draft.name.trim()) return;
        setPlants((current) => [...current, { ...draft, id: Date.now(), name: draft.name.trim(), type: draft.type.trim() || "New plant", room: draft.room.trim() || "Unplaced", waterEvery: Number(draft.waterEvery), lastWatered: dateOffset(0) }]);
        setDraft({ name: "", type: "", room: "", waterEvery: "7", light: "Bright, indirect" });
    };
    const waterPlant = (id) => setPlants((current) => current.map((plant) => plant.id === id ? { ...plant, lastWatered: dateOffset(0) } : plant));
    const removePlant = () => {
        setPlants((current) => current.filter((plant) => plant.id !== pendingDelete.id));
        setPendingDelete(null);
    };

    return (
        <section className={styles.plantCareCalendar} id="workspace">
            <div className={styles.gardenHeader}>
                <div><p className={styles.label}>YOUR INDOOR GARDEN</p><h1>Grow at your<br /><span>own rhythm.</span></h1><p className={styles.description}>A calm little place for your plants and their routines.</p></div>
                <div className={styles.waterSummary}><span className={styles.waterDrop}><FiDroplet aria-hidden="true" /></span><div><strong>{needsWater}</strong><span>could use a drink</span></div><span className={styles.summaryDate}>THIS WEEK</span></div>
            </div>
            <div className={styles.weatherStrip}><FiSun aria-hidden="true" /><p>Plant note</p><span>Check the soil before watering. Light and room temperature can change how quickly each pot dries.</span></div>
            <section className={styles.plantSection} aria-label="Plant collection">
                <div className={styles.sectionHeading}><div><h2>Plants at home</h2><p>{plants.length} pots in your collection</p></div><label className={styles.searchBox}><span>Find a plant</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search plants" /></label></div>
                <div className={styles.toolbar} role="group" aria-label="Filter plants">{["All plants", "Needs water", "Doing fine"].map((option) => <button key={option} type="button" className={filter === option ? styles.activeTab : ""} onClick={() => setFilter(option)}>{option}<span>{option === "All plants" ? plants.length : option === "Needs water" ? needsWater : plants.length - needsWater}</span></button>)}</div>
                <div className={styles.plantGrid}>
                    {visiblePlants.map((plant, index) => {
                        const days = daysUntilWater(plant);
                        const due = days <= 0;
                        return <article className={styles.plantCard} key={plant.id}>
                            <div className={styles.plantArt + " " + styles["plantArt" + (index % 4)]}><span className={styles.pot}></span><i></i><b></b><small>{plant.name.slice(0, 1)}</small></div>
                            <div className={styles.plantDetails}><div className={styles.cardTop}><span>{plant.room}</span><button type="button" className={styles.deleteButton} aria-label={"Delete " + plant.name} onClick={() => setPendingDelete(plant)}><FiTrash2 aria-hidden="true" /></button></div>
                                <h3>{plant.name}</h3><p className={styles.species}>{plant.type}</p>
                                <div className={styles.careInfo}><span>Water every</span><strong>{plant.waterEvery} days</strong><span>Light</span><strong>{plant.light}</strong></div>
                                <div className={due ? styles.dueNotice : styles.okNotice}><FiDroplet aria-hidden="true" /><span>{due ? "Ready for water" : "Water in " + days + " days"}</span></div>
                                <button type="button" className={styles.waterButton} onClick={() => waterPlant(plant.id)}><FiDroplet aria-hidden="true" /> Watered today</button>
                            </div>
                        </article>;
                    })}
                    {visiblePlants.length === 0 && <div className={styles.emptyState}>No plants match that view. Add a plant below.</div>}
                </div>
            </section>
            <form className={styles.addForm} id="add" onSubmit={addPlant}>
                <div className={styles.formTitle}><span>+</span><div><h2>Add a plant</h2><p>Keep the care notes nearby.</p></div></div>
                <label>Plant name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Snake plant" /></label>
                <label>Species<input value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} placeholder="Optional" /></label>
                <label>Room<input value={draft.room} onChange={(event) => setDraft({ ...draft, room: event.target.value })} placeholder="Where it lives" /></label>
                <label>Water every<input type="number" min="1" value={draft.waterEvery} onChange={(event) => setDraft({ ...draft, waterEvery: event.target.value })} /></label>
                <label>Light<select value={draft.light} onChange={(event) => setDraft({ ...draft, light: event.target.value })}><option>Bright, indirect</option><option>Sunny window</option><option>Low to medium</option><option>Shade</option></select></label>
                <button type="submit" className={styles.addButton}><FiPlus aria-hidden="true" /> Add plant</button>
            </form>
            <p className={styles.localNote}>Water reminders are estimates. Check the soil and follow the needs of each plant.</p>
            {pendingDelete && <ConfirmDialog title="Remove this plant?" description={"“" + pendingDelete.name + "” will be removed from your collection."} onCancel={() => setPendingDelete(null)} onConfirm={removePlant} />}
        </section>
    );
};

export default PlantCareCalendar;
