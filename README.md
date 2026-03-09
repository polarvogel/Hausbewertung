Haus-Test Pro (GitHub Pages Deployment)Diese Anleitung erklärt, wie das Projekt direkt über GitHub bereitgestellt wird, ohne dass eine lokale Node.js-Installation erforderlich ist.Schritt 1: GitHub Repository erstellenLogge dich auf GitHub ein und erstelle ein neues, öffentliches Repository. Nenne es z.B. haus-test-pro.Kopiere den exakten Namen des Repositories.Schritt 2: Konfiguration anpassenÖffne die beiliegende Datei vite.config.js in einem einfachen Texteditor.Ändere die Zeile base: '/DEIN-REPO-NAME/' ab, sodass dein Repository-Name dort steht (z.B. base: '/haus-test-pro/'). Achte auf die Schrägstriche am Anfang und Ende.Speichere die Datei.Schritt 3: Der "One-Click" Upload (Drag & Drop)Du musst Git nicht lokal installieren oder im Terminal arbeiten. Nutze einfach die Weboberfläche von GitHub:Öffne dein neu erstelltes Repository im Browser.Klicke auf den Link "uploading an existing file" (oder den Button "Add file" -> "Upload files").Markiere lokal alle Projektdateien und Ordner (inklusive des .github Ordners) und ziehe sie per Drag & Drop in das Browserfenster.Klicke unten auf den grünen Button "Commit changes".Die Ordnerstruktur auf GitHub muss danach exakt so aussehen:/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
Schritt 4: Automatisches Deployment aktivierenSobald die Dateien hochgeladen sind, baut GitHub die Seite automatisch im Hintergrund. So aktivierst du die Auslieferung:Gehe in deinem GitHub Repository oben auf Settings (Einstellungen).Klicke links im Menü auf Pages.Unter Build and deployment > Source wählst du GitHub Actions aus (nicht "Deploy from a branch").Gehe oben auf den Tab Actions. Hier siehst du, wie dein Code gerade gebaut wird (gekennzeichnet durch einen gelben Punkt, der später zu einem grünen Haken wird).Sobald der Vorgang grün markiert ist, findest du den finalen Link zu deiner fertigen App unter den Repository-Einstellungen bei "Pages" oder direkt im Log unter "Actions".
