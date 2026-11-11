import { useMemo, useState } from "react";
import { FiDroplet, FiPlus, FiSun, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog";
import styles from "./styles.module.css";

const storageKey = "little-green-plant-list";
const dateOffset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const starterPlants = [
    { id: 1, name: "Monstera", type: "Monstera deliciosa", room: "Living room", waterEvery: 7, lastWatered: dateOffset(-8), light: "Bright, indirect" },
    { id: 2, name: "Jade plant", type: "Crassula ovata", room: "Kitchen sill", waterEvery: 14, lastWatered: dateOffset(-10), light: "Sunny window" },
    { id: 3, name: "Bird of paradise", type: "Strelitzia", room: "Bedroom", waterEvery: 6, lastWatered: dateOffset(-7), light: "Bright, indirect" },
    { id: 4, name: "Pothos", type: "Epipremnum aureum", room: "Bookshelf", waterEvery: 9, lastWatered: dateOffset(-4), light: "Low to medium" },
];
const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return year >= 1000 && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const normalizePlants = (value) => {
    if (!Array.isArray(value)) return null;
    const plants = value.map((plant) => {
        if (!plant || typeof plant !== "object" || !(typeof plant.id === "string" || (typeof plant.id === "number" && Number.isFinite(plant.id))) || typeof plant.name !== "string" || !plant.name.trim() || typeof plant.type !== "string" || typeof plant.room !== "string" || !Number.isInteger(plant.waterEvery) || plant.waterEvery < 1 || plant.waterEvery > 3650 || !isValidDate(plant.lastWatered) || typeof plant.light !== "string") return null;
        return { ...plant, name: plant.name.trim(), type: plant.type.trim(), room: plant.room.trim() };
    });
    return plants.every(Boolean) ? plants : null;
};

const readPlants = () => {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved === null) return { value: starterPlants, notice: "" };
        const normalized = normalizePlants(JSON.parse(saved));
        return normalized ? { value: normalized, notice: "" } : { value: starterPlants, notice: "Saved plant records could not be read. You can still use the collection during this visit." };
    } catch {
        return { value: starterPlants, notice: "Saved plant records could not be read. You can still use the collection during this visit." };
    }
};
const dayNumber = (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
};
const daysUntilWater = (plant) => {
    const today = new Date();
    const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return plant.waterEvery - (dayNumber(todayValue) - dayNumber(plant.lastWatered));
};

const PlantCareCalendar = () => {
    const [savedPlants] = useState(readPlants);
    const [plants, setPlants] = useState(savedPlants.value);
    const [storageNotice, setStorageNotice] = useState(savedPlants.notice);
    const [filter, setFilter] = useState("All plants");
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState({ name: "", type: "", room: "", waterEvery: "7", light: "Bright, indirect" });
    const [pendingDelete, setPendingDelete] = useState(null);
    const persistPlants = (nextPlants) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(nextPlants));
            setStorageNotice("");
        } catch {
            setStorageNotice("Plant records could not be saved in this browser. Changes will reset when you leave this page.");
        }
    };

    const needsWater = plants.filter((plant) => daysUntilWater(plant) <= 0).length;
    const visiblePlants = useMemo(() => plants.filter((plant) => {
        const due = daysUntilWater(plant) <= 0;
        const matchesFilter = filter === "All plants" || (filter === "Needs water" ? due : !due);
        return matchesFilter && (plant.name + " " + plant.type + " " + plant.room).toLowerCase().includes(query.toLowerCase());
    }), [plants, filter, query]);
    const addPlant = (event) => {
        event.preventDefault();
        const waterEvery = Number(draft.waterEvery);
        if (!draft.name.trim() || !Number.isInteger(waterEvery) || waterEvery < 1 || waterEvery > 3650) return;
        const nextPlants = [...plants, { ...draft, id: Date.now(), name: draft.name.trim(), type: draft.type.trim() || "New plant", room: draft.room.trim() || "Unplaced", waterEvery, lastWatered: dateOffset(0) }];
        persistPlants(nextPlants);
        setPlants(nextPlants);
        setDraft({ name: "", type: "", room: "", waterEvery: "7", light: "Bright, indirect" });
    };
    const waterPlant = (id) => {
        const nextPlants = plants.map((plant) => plant.id === id ? { ...plant, lastWatered: dateOffset(0) } : plant);
        persistPlants(nextPlants);
        setPlants(nextPlants);
    };
    const removePlant = () => {
        const nextPlants = plants.filter((plant) => plant.id !== pendingDelete.id);
        persistPlants(nextPlants);
        setPlants(nextPlants);
        setPendingDelete(null);
    };

    return (
        <section className={styles.plantCareCalendar} id="workspace">
            <div className={styles.gardenHeader}>
                <div><p className={styles.label}>YOUR INDOOR GARDEN</p><h1>Grow at your<br /><span>own rhythm.</span></h1><p className={styles.description}>A calm little place for your plants and their routines.</p></div>
                <div className={styles.waterSummary}><span className={styles.waterDrop}><FiDroplet aria-hidden="true" /></span><div><strong>{needsWater}</strong><span>could use a drink</span></div><span className={styles.summaryDate}>NEED WATER</span></div>
            </div>
            {storageNotice && <p className={styles.storageNotice} role="status">{storageNotice}</p>}
            <div className={styles.weatherStrip}><FiSun aria-hidden="true" /><p>Plant note</p><span>Check the soil before watering. Light and room temperature can change how quickly each pot dries.</span></div>
            <section className={styles.plantSection} aria-label="Plant collection">
                <div className={styles.sectionHeading}><div><h2>Plants at home</h2><p>{plants.length} pots in your collection</p></div><label className={styles.searchBox}><span>Find a plant</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search plants" /></label></div>
                <div className={styles.toolbar} role="group" aria-label="Filter plants">{["All plants", "Needs water", "Doing fine"].map((option) => <button key={option} type="button" className={filter === option ? styles.activeTab : ""} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}<span>{option === "All plants" ? plants.length : option === "Needs water" ? needsWater : plants.length - needsWater}</span></button>)}</div>
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
                <label>Water every<input required type="number" min="1" max="3650" step="1" value={draft.waterEvery} onChange={(event) => setDraft({ ...draft, waterEvery: event.target.value })} /></label>
                <label>Light<select value={draft.light} onChange={(event) => setDraft({ ...draft, light: event.target.value })}><option>Bright, indirect</option><option>Sunny window</option><option>Low to medium</option><option>Shade</option></select></label>
                <button type="submit" className={styles.addButton}><FiPlus aria-hidden="true" /> Add plant</button>
            </form>
            <p className={styles.localNote}>Water reminders are estimates. Check the soil and follow the needs of each plant.</p>
            {pendingDelete && <ConfirmDialog title="Remove this plant?" description={"“" + pendingDelete.name + "” will be removed from your collection."} onCancel={() => setPendingDelete(null)} onConfirm={removePlant} />}
        </section>
    );
};

export default PlantCareCalendar;
