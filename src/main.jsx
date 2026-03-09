import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { Camera, Printer, Trash2 } from 'lucide-react';

/* Definiert die grundlegende Struktur und die Standardwerte für die 13 Bewertungskriterien. */
const DEFAULT_CRITERIA = [
    { id: 'bau', emoji: '🏚️', title: 'Bausubstanz & Sanierung', desc: '(Keller, Dach, Technik, Feuchtigkeit)', value: 5, ko: false, gold: false, note: '' },
    { id: 'energie', emoji: '⚡', title: 'Energetik & PV-Potential', desc: '(Heizung, Fenster, Solar-Eignung)', value: 5, ko: false, gold: false, note: '' },
    { id: 'wohnen', emoji: '🛋️', title: 'Wohnwert & Grundriss', desc: '(Aufteilung, Licht, Zimmeranzahl)', value: 5, ko: false, gold: false, note: '' },
    { id: 'hobby', emoji: '🛠️', title: 'Hobby, Werkstatt & Business', desc: '(Labor, 3D-Druck, Praxis-Eignung)', value: 5, ko: false, gold: false, note: '' },
    { id: 'logistik', emoji: '🚐', title: 'Fuhrpark & Logistik', desc: '(Camper-Maße, Vespa-Garage, Fahrräder)', value: 5, ko: false, gold: false, note: '' },
    { id: 'pendeln', emoji: '🚆', title: 'Arbeitswege', desc: '(Pendelzeit, Flexibilität, Stressfaktor)', value: 5, ko: false, gold: false, note: '' },
    { id: 'garten', emoji: '🌻', title: 'Garten & Außenanlagen', desc: '(Terrasse, Sichtschutz, Grünfläche)', value: 5, ko: false, gold: false, note: '' },
    { id: 'natur', emoji: '🌲', title: 'Natur-Faktor', desc: '(Wald, Parks, Aussicht)', value: 5, ko: false, gold: false, note: '' },
    { id: 'ruhe', emoji: '🔇', title: 'Ruhe-Faktor (Anti-Lärm)', desc: '(Schutz vor Straße, Flugzeug, Bahn)', value: 5, ko: false, gold: false, note: '' },
    { id: 'lage', emoji: '📍', title: 'Lage & Lifestyle', desc: '(Infrastruktur, Gastro, Rad-Anschluss)', value: 5, ko: false, gold: false, note: '' },
    { id: 'nachbarn', emoji: '🏘️', title: 'Nachbarschaft', desc: '(Leute, Straße, Umfeld, Industrie)', value: 5, ko: false, gold: false, note: '' },
    { id: 'recht', emoji: '⚖️', title: 'Recht & Risiko', desc: '(Grundbuch, Genehmigung, Optik)', value: 5, ko: false, gold: false, note: '' },
    { id: 'preis', emoji: '💰', title: 'Kaufpreis & Budget', desc: '(Preis-Leistung, Nebenkosten, Spielraum)', value: 5, ko: false, gold: false, note: '' }
];

/* Ermittelt die passende Tailwind-Farbklasse für die Segmente des Bewertungs-Sliders basierend auf dem aktuellen Wert. */
function getSegmentColorClass(val) {
    if (val <= 3) return 'bg-rose-300';
    if (val <= 6) return 'bg-orange-300';
    return 'bg-emerald-300';
}

/* Hauptkomponente der Anwendung. */
export default function App() {
    const [meta, setMeta] = useState({ name: '', address: '', price: '', fazit: '', photo: null });
    const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
    const [isLoaded, setIsLoaded] = useState(false);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('hausTestStatePro');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.meta) setMeta(parsed.meta);
                if (parsed.criteria && parsed.criteria.length === DEFAULT_CRITERIA.length) {
                    setCriteria(parsed.criteria);
                }
            }
        } catch (e) {
            console.error('Fehler beim Laden aus LocalStorage', e);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('hausTestStatePro', JSON.stringify({ meta, criteria }));
            } catch (e) {
                console.warn('Speichern fehlgeschlagen. Möglicherweise ist das Bild zu groß.', e);
            }
        }
    }, [meta, criteria, isLoaded]);

    useEffect(() => {
        if (!chartRef.current || !isLoaded) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const labels = criteria.map(c => `${c.emoji} ${c.title.split(' ')[0]}`);
        const data = criteria.map(c => c.value);
        const pointColors = criteria.map(c => {
            if(c.ko) return '#ef4444';
            if(c.gold || c.value === 10) return '#eab308';
            return '#10b981';
        });

        chartInstance.current = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bewertung',
                    data: data,
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                                          borderColor: '#34d399',
                                          pointBackgroundColor: pointColors,
                                          pointBorderColor: '#fff',
                                          pointBorderWidth: 2,
                                          borderWidth: 3,
                                          pointRadius: 5,
                                          pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        ticks: { stepSize: 2, display: false },
                        grid: { color: '#e2e8f0', circular: true, lineWidth: 1.5 },
                        angleLines: { color: '#e2e8f0' },
                        pointLabels: { font: { size: 14, family: 'system-ui', weight: '600' }, color: '#475569' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [criteria, isLoaded]);

    const updateMeta = useCallback((field, value) => {
        setMeta(prev => ({ ...prev, [field]: value }));
    }, []);

    const handlePhotoUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            updateMeta('photo', e.target.result);
        };
        reader.readAsDataURL(file);
    }, [updateMeta]);

    const updateCriterion = useCallback((index, field, value) => {
        setCriteria(prev => {
            const newCriteria = [...prev];
            newCriteria[index] = { ...newCriteria[index], [field]: value };
            return newCriteria;
        });
    }, []);

    const toggleSpecialFlag = useCallback((index, flag, value) => {
        setCriteria(prev => {
            const newCriteria = [...prev];
            const crit = { ...newCriteria[index] };

            if (flag === 'ko') {
                crit.ko = value;
                if (value) crit.gold = false;
            } else if (flag === 'gold') {
                crit.gold = value;
                if (value) crit.ko = false;
            }

            newCriteria[index] = crit;
            return newCriteria;
        });
    }, []);

    const resetData = useCallback(() => {
        if (window.confirm('Alle Daten wirklich löschen?')) {
            setMeta({ name: '', address: '', price: '', fazit: '', photo: null });
            setCriteria(DEFAULT_CRITERIA);
        }
    }, []);

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans print:bg-white print:p-0">
        <style dangerouslySetInnerHTML={{__html: `
            @media print {
                @page { margin: 1cm; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            `}} />

            <div className="max-w-6xl mx-auto space-y-8 print:space-y-6">

            <header className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 print:shadow-none print:border-none print:break-inside-avoid">
            <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
            {!meta.photo ? (
                <label className="relative w-full aspect-video bg-sky-50 rounded-2xl border-2 border-dashed border-sky-200 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-100 transition-colors print:hidden group">
                <Camera className="text-sky-400 mb-2 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-sky-600 font-medium">Foto hochladen (16:9)</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
            ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 group">
                <img src={meta.photo} alt="Haus" className="w-full h-full object-cover" />
                <button
                onClick={() => updateMeta('photo', null)}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity print:hidden shadow-sm"
                title="Foto entfernen"
                >
                <Trash2 size={18} />
                </button>
                </div>
            )}
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-700 tracking-tight">
            🏡 Haus-Test Pro
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
            <label className="text-sm font-semibold text-slate-500 ml-2">Objektname / Referenz</label>
            <input
            type="text"
            value={meta.name}
            onChange={(e) => updateMeta('name', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-300 outline-none transition-all print:border-none print:bg-transparent print:p-0 print:text-lg print:font-bold"
            placeholder="Traumhaus im Grünen..."
            />
            </div>
            <div>
            <label className="text-sm font-semibold text-slate-500 ml-2">Adresse</label>
            <input
            type="text"
            value={meta.address}
            onChange={(e) => updateMeta('address', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-300 outline-none transition-all print:border-none print:bg-transparent print:p-0 print:text-lg"
            placeholder="Musterstraße 1..."
            />
            </div>
            <div>
            <label className="text-sm font-semibold text-slate-500 ml-2">Kaufpreis (€)</label>
            <input
            type="text"
            value={meta.price}
            onChange={(e) => updateMeta('price', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-300 outline-none transition-all print:border-none print:bg-transparent print:p-0 print:text-lg"
            placeholder="500.000"
            />
            </div>
            </div>
            </div>
            </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 print:hidden">
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-rose-300"></div> 0-3 (Kritisch)</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-orange-300"></div> 4-6 (Mittel)</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-emerald-300"></div> 7-10 (Gut)</div>
            <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-2">⚠️ <span className="text-rose-600">KO-Faktor</span></div>
            <div className="flex items-center gap-2">🏆 <span className="text-yellow-600 font-bold">Gold-Standard</span></div>
            </div>

            <div className="space-y-6">
            {criteria.map((crit, index) => {
                const isGold = crit.gold || crit.value === 10;
                const isCriticalWarning = crit.ko && crit.value < 5;
                const isClearedHurdle = crit.ko && crit.value >= 8;

                let containerClasses = "bg-white rounded-3xl p-5 md:p-6 transition-all border-2 print:break-inside-avoid print:shadow-none ";
                if (crit.ko) containerClasses += " border-rose-200 shadow-[0_0_15px_rgba(254,205,211,0.6)] ";
                else if (isGold) containerClasses += " border-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.4)] ";
                else containerClasses += " border-slate-100 shadow-sm ";

                return (
                    <div key={crit.id} className={containerClasses}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <span className="text-2xl">{crit.emoji}</span>
                    {crit.title}
                    {crit.ko && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-bold ml-2 uppercase tracking-wide">⚠️ KO-Faktor</span>}
                    {isGold && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold ml-2 uppercase tracking-wide">🏆 Gold</span>}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{crit.desc}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 print:hidden">
                    <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer px-4 py-2 rounded-xl border transition-colors ${crit.ko ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                    <input
                    type="checkbox"
                    checked={crit.ko}
                    onChange={(e) => toggleSpecialFlag(index, 'ko', e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500 w-4 h-4 accent-rose-500"
                    />
                    ⚠️ KO
                    </label>

                    <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer px-4 py-2 rounded-xl border transition-colors ${crit.gold ? 'bg-yellow-50 border-yellow-400 text-yellow-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                    <input
                    type="checkbox"
                    checked={crit.gold}
                    onChange={(e) => toggleSpecialFlag(index, 'gold', e.target.checked)}
                    className="rounded text-yellow-500 focus:ring-yellow-500 w-4 h-4 accent-yellow-500"
                    />
                    🏆 Gold
                    </label>
                    </div>
                    </div>

                    {isCriticalWarning && (
                        <div className="mb-4 bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 font-bold text-sm flex items-center gap-2">
                        🚩 Hier gibt es Klärungsbedarf! (KO-Kriterium ungenügend)
                        </div>
                    )}
                    {isClearedHurdle && (
                        <div className="mb-4 bg-yellow-50 text-yellow-700 p-3 rounded-xl border border-yellow-200 font-bold text-sm flex items-center gap-2">
                        ✨ Hürde genommen! (Starkes KO-Kriterium)
                        </div>
                    )}

                    <div className="flex gap-1 mb-4 print:hidden">
                    {[...Array(11)].map((_, i) => (
                        <button
                        key={i}
                        onClick={() => updateCriterion(index, 'value', i)}
                        className={`flex-1 h-8 md:h-10 rounded-lg transition-all hover:opacity-80 ${i <= crit.value ? getSegmentColorClass(crit.value) : 'bg-slate-100'}`}
                        title={`Wert: ${i}`}
                        />
                    ))}
                    </div>

                    <div className="hidden print:block mb-4">
                    <span className="font-bold text-slate-700">Bewertung: {crit.value} / 10</span>
                    </div>

                    <div className="relative mt-2">
                    <span className="absolute left-4 top-3 text-slate-400 print:hidden">📝</span>
                    <textarea
                    value={crit.note}
                    onChange={(e) => updateCriterion(index, 'note', e.target.value)}
                    rows="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-y print:border-none print:bg-transparent print:p-0 print:pl-0"
                    placeholder="Notizen zur Bewertung..."
                    />
                    </div>
                    </div>
                );
            })}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 print:shadow-none print:border-none print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-700 mb-8 flex items-center justify-center gap-2">📊 Evaluierungs-Profil</h2>

            <div className="w-full h-[400px] md:h-[600px] mb-8">
            <canvas ref={chartRef}></canvas>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center print:hidden pt-6 border-t border-slate-100">
            <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2"
            >
            <Printer size={20} /> Bericht erstellen
            </button>
            <button
            onClick={resetData}
            className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold py-4 px-8 rounded-2xl transition-colors flex justify-center items-center gap-2"
            >
            <Trash2 size={18} /> Daten zurücksetzen
            </button>
            </div>
            </div>

            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 print:shadow-none print:border-none print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">✍️ Fazit & Endgültige Gedanken</h2>
            <textarea
            value={meta.fazit}
            onChange={(e) => updateMeta('fazit', e.target.value)}
            rows="4"
            className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-sky-300 outline-none transition-all resize-y text-slate-700 print:bg-transparent print:border-none print:p-0"
            placeholder="Zusammenfassung des Eindrucks, nächste Schritte..."
            />
            </section>

            </div>
            </div>
    );
}import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { Camera, Printer, Trash2 } from 'lucide-react';

/* Definiert die grundlegende Struktur und die Standardwerte für die 13 Bewertungskriterien. */
const DEFAULT_CRITERIA = [
    { id: 'bau', emoji: '🏚️', title: 'Bausubstanz & Sanierung', desc: '(Keller, Dach, Technik, Feuchtigkeit)', value: 5, ko: false, gold: false, note: '' },
    { id: 'energie', emoji: '⚡', title: 'Energetik & PV-Potential', desc: '(Heizung, Fenster, Solar-Eignung)', value: 5, ko: false, gold: false, note: '' },
    { id: 'wohnen', emoji: '🛋️', title: 'Wohnwert & Grundriss', desc: '(Aufteilung, Licht, Zimmeranzahl)', value: 5, ko: false, gold: false, note: '' },
    { id: 'hobby', emoji: '🛠️', title: 'Hobby, Werkstatt & Business', desc: '(Labor, 3D-Druck, Praxis-Eignung)', value: 5, ko: false, gold: false, note: '' },
    { id: 'logistik', emoji: '🚐', title: 'Fuhrpark & Logistik', desc: '(Camper-Maße, Vespa-Garage, Fahrräder)', value: 5, ko: false, gold: false, note: '' },
    { id: 'pendeln', emoji: '🚆', title: 'Arbeitswege', desc: '(Pendelzeit, Flexibilität, Stressfaktor)', value: 5, ko: false, gold: false, note: '' },
    { id: 'garten', emoji: '🌻', title: 'Garten & Außenanlagen', desc: '(Terrasse, Sichtschutz, Grünfläche)', value: 5, ko: false, gold: false, note: '' },
    { id: 'natur', emoji: '🌲', title: 'Natur-Faktor', desc: '(Wald, Parks, Aussicht)', value: 5, ko: false, gold: false, note: '' },
    { id: 'ruhe', emoji: '🔇', title: 'Ruhe-Faktor (Anti-Lärm)', desc: '(Schutz vor Straße, Flugzeug, Bahn)', value: 5, ko: false, gold: false, note: '' },
    { id: 'lage', emoji: '📍', title: 'Lage & Lifestyle', desc: '(Infrastruktur, Gastro, Rad-Anschluss)', value: 5, ko: false, gold: false, note: '' },
    { id: 'nachbarn', emoji: '🏘️', title: 'Nachbarschaft', desc: '(Leute, Straße, Umfeld, Industrie)', value: 5, ko: false, gold: false, note: '' },
    { id: 'recht', emoji: '⚖️', title: 'Recht & Risiko', desc: '(Grundbuch, Genehmigung, Optik)', value: 5, ko: false, gold: false, note: '' },
    { id: 'preis', emoji: '💰', title: 'Kaufpreis & Budget', desc: '(Preis-Leistung, Nebenkosten, Spielraum)', value: 5, ko: false, gold: false, note: '' }
];

/* Ermittelt die passende Tailwind-Farbklasse für die Segmente des Bewertungs-Sliders basierend auf dem aktuellen Wert. */
function getSegmentColorClass(val) {
    if (val <= 3) return 'bg-rose-300';
    if (val <= 6) return 'bg-orange-300';
    return 'bg-emerald-300';
}

/* Hauptkomponente der Anwendung. */
export default function App() {
    const [meta, setMeta] = useState({ name: '', address: '', price: '', fazit: '', photo: null });
    const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
    const [isLoaded, setIsLoaded] = useState(false);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('hausTestStatePro');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.meta) setMeta(parsed.meta);
                if (parsed.criteria && parsed.criteria.length === DEFAULT_CRITERIA.length) {
                    setCriteria(parsed.criteria);
                }
            }
        } catch (e) {
            console.error('Fehler beim Laden aus LocalStorage', e);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('hausTestStatePro', JSON.stringify({ meta, criteria }));
            } catch (e) {
                console.warn('Speichern fehlgeschlagen. Möglicherweise ist das Bild zu groß.', e);
            }
        }
    }, [meta, criteria, isLoaded]);

    useEffect(() => {
        if (!chartRef.current || !isLoaded) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const labels = criteria.map(c => `${c.emoji} ${c.title.split(' ')[0]}`);
        const data = criteria.map(c => c.value);
        const pointColors = criteria.map(c => {
            if(c.ko) return '#ef4444';
            if(c.gold || c.value === 10) return '#eab308';
            return '#10b981';
        });

        chartInstance.current = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bewertung',
                    data: data,
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                                          borderColor: '#34d399',
                                          pointBackgroundColor: pointColors,
                                          pointBorderColor: '#fff',
                                          pointBorderWidth: 2,
                                          borderWidth: 3,
                                          pointRadius: 5,
                                          pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        ticks: { stepSize: 2, display: false },
                        grid: { color: '#e2e8f0', circular: true, lineWidth: 1.5 },
                        angleLines: { color: '#e2e8f0' },
                        pointLabels: { font: { size: 14, family: 'system-ui', weight: '600' }, color: '#475569' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [criteria, isLoaded]);

    const updateMeta = useCallback((field, value) => {
        setMeta(prev => ({ ...prev, [field]: value }));
    }, []);

    const handlePhotoUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            updateMeta('photo', e.target.result);
        };
        reader.readAsDataURL(file);
    }, [updateMeta]);

    const updateCriterion = useCallback((index, field, value) => {
        setCriteria(prev => {
            const newCriteria = [...prev];
            newCriteria[index] = { ...newCriteria[index], [field]: value };
            return newCriteria;
        });
    }, []);

    const toggleSpecialFlag = useCallback((index, flag, value) => {
        setCriteria(prev => {
            const newCriteria = [...prev];
            const crit = { ...newCriteria[index] };

            if (flag === 'ko') {
                crit.ko = value;
                if (value) crit.gold = false;
            } else if (flag === 'gold') {
                crit.gold = value;
                if (value) crit.ko = false;
            }

            newCriteria[index] = crit;
            return newCriteria;
        });
    }, []);

    const resetData = useCallback(() => {
        if (window.confirm('Alle Daten wirklich löschen?')) {
            setMeta({ name: '', address: '', price: '', fazit: '', photo: null });
            setCriteria(DEFAULT_CRITERIA);
        }
    }, []);

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans print:bg-white print:p-0">
        <style dangerouslySetInnerHTML={{__html: `
            @media print {
                @page { margin: 1cm; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            `}} />

            <div className="max-w-6xl mx-auto space-y-8 print:space-y-6">

            <header className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 print:shadow-none print:border-none print:break-inside-avoid">
            <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
            {!meta.photo ? (
                <label className="relative w-full aspect-video bg-sky-50 rounded-2xl border-2 border-dashed border-sky-200 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-100 transition-colors print:hidden group">
                <Camera className="text-sky-400 mb-2 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-sky-600 font-medium">Foto hochladen (16:9)</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
            ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 group">
                <img src={meta.photo} alt="Haus" className="w-full h-full object-cover" />
                <button
                onClick={() => updateMeta('photo', null)}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity print:hidden shadow-sm"
                title="Foto entfernen"
                >
                <Trash2 size={18} />
                </button>
                </div>
            )}
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-700 tracking-tight">
            🏡 Haus-Test Pro
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
            <label className="text-sm font-semibold text-slate-500 ml-2">Objektname / Referenz</label>
            <input
            type="text"
            value={meta.name}
            onChange={(e) => updateMeta('name', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-300 outline-none transition-all print:border-none print:bg-transparent print:p-0 print:text-lg print:font-bold"
            placeholder="Traumhaus im Grünen..."
            />
            </div>
            <div>
            <label className="text-sm font-semibold text-slate-500 ml-2">Adresse</label>
            <input
            type="text"
            value={meta.address}
            onChange={(e) => updateMeta('address', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-300 outline-none transition-all print:border-none print:bg-transparent print:p-0 print:text-lg"
            placeholder="Musterstraße 1..."
            />
            </div>
            <div>
            <label className="text-sm font-semibold text-slate-500 ml-2">Kaufpreis (€)</label>
            <input
            type="text"
            value={meta.price}
            onChange={(e) => updateMeta('price', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-300 outline-none transition-all print:border-none print:bg-transparent print:p-0 print:text-lg"
            placeholder="500.000"
            />
            </div>
            </div>
            </div>
            </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 print:hidden">
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-rose-300"></div> 0-3 (Kritisch)</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-orange-300"></div> 4-6 (Mittel)</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-emerald-300"></div> 7-10 (Gut)</div>
            <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-2">⚠️ <span className="text-rose-600">KO-Faktor</span></div>
            <div className="flex items-center gap-2">🏆 <span className="text-yellow-600 font-bold">Gold-Standard</span></div>
            </div>

            <div className="space-y-6">
            {criteria.map((crit, index) => {
                const isGold = crit.gold || crit.value === 10;
                const isCriticalWarning = crit.ko && crit.value < 5;
                const isClearedHurdle = crit.ko && crit.value >= 8;

                let containerClasses = "bg-white rounded-3xl p-5 md:p-6 transition-all border-2 print:break-inside-avoid print:shadow-none ";
                if (crit.ko) containerClasses += " border-rose-200 shadow-[0_0_15px_rgba(254,205,211,0.6)] ";
                else if (isGold) containerClasses += " border-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.4)] ";
                else containerClasses += " border-slate-100 shadow-sm ";

                return (
                    <div key={crit.id} className={containerClasses}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <span className="text-2xl">{crit.emoji}</span>
                    {crit.title}
                    {crit.ko && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-bold ml-2 uppercase tracking-wide">⚠️ KO-Faktor</span>}
                    {isGold && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold ml-2 uppercase tracking-wide">🏆 Gold</span>}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{crit.desc}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 print:hidden">
                    <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer px-4 py-2 rounded-xl border transition-colors ${crit.ko ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                    <input
                    type="checkbox"
                    checked={crit.ko}
                    onChange={(e) => toggleSpecialFlag(index, 'ko', e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500 w-4 h-4 accent-rose-500"
                    />
                    ⚠️ KO
                    </label>

                    <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer px-4 py-2 rounded-xl border transition-colors ${crit.gold ? 'bg-yellow-50 border-yellow-400 text-yellow-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                    <input
                    type="checkbox"
                    checked={crit.gold}
                    onChange={(e) => toggleSpecialFlag(index, 'gold', e.target.checked)}
                    className="rounded text-yellow-500 focus:ring-yellow-500 w-4 h-4 accent-yellow-500"
                    />
                    🏆 Gold
                    </label>
                    </div>
                    </div>

                    {isCriticalWarning && (
                        <div className="mb-4 bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 font-bold text-sm flex items-center gap-2">
                        🚩 Hier gibt es Klärungsbedarf! (KO-Kriterium ungenügend)
                        </div>
                    )}
                    {isClearedHurdle && (
                        <div className="mb-4 bg-yellow-50 text-yellow-700 p-3 rounded-xl border border-yellow-200 font-bold text-sm flex items-center gap-2">
                        ✨ Hürde genommen! (Starkes KO-Kriterium)
                        </div>
                    )}

                    <div className="flex gap-1 mb-4 print:hidden">
                    {[...Array(11)].map((_, i) => (
                        <button
                        key={i}
                        onClick={() => updateCriterion(index, 'value', i)}
                        className={`flex-1 h-8 md:h-10 rounded-lg transition-all hover:opacity-80 ${i <= crit.value ? getSegmentColorClass(crit.value) : 'bg-slate-100'}`}
                        title={`Wert: ${i}`}
                        />
                    ))}
                    </div>

                    <div className="hidden print:block mb-4">
                    <span className="font-bold text-slate-700">Bewertung: {crit.value} / 10</span>
                    </div>

                    <div className="relative mt-2">
                    <span className="absolute left-4 top-3 text-slate-400 print:hidden">📝</span>
                    <textarea
                    value={crit.note}
                    onChange={(e) => updateCriterion(index, 'note', e.target.value)}
                    rows="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-y print:border-none print:bg-transparent print:p-0 print:pl-0"
                    placeholder="Notizen zur Bewertung..."
                    />
                    </div>
                    </div>
                );
            })}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 print:shadow-none print:border-none print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-700 mb-8 flex items-center justify-center gap-2">📊 Evaluierungs-Profil</h2>

            <div className="w-full h-[400px] md:h-[600px] mb-8">
            <canvas ref={chartRef}></canvas>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center print:hidden pt-6 border-t border-slate-100">
            <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2"
            >
            <Printer size={20} /> Bericht erstellen
            </button>
            <button
            onClick={resetData}
            className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold py-4 px-8 rounded-2xl transition-colors flex justify-center items-center gap-2"
            >
            <Trash2 size={18} /> Daten zurücksetzen
            </button>
            </div>
            </div>

            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 print:shadow-none print:border-none print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">✍️ Fazit & Endgültige Gedanken</h2>
            <textarea
            value={meta.fazit}
            onChange={(e) => updateMeta('fazit', e.target.value)}
            rows="4"
            className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-sky-300 outline-none transition-all resize-y text-slate-700 print:bg-transparent print:border-none print:p-0"
            placeholder="Zusammenfassung des Eindrucks, nächste Schritte..."
            />
            </section>

            </div>
            </div>
    );
}
