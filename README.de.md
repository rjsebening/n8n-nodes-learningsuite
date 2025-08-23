# n8n-nodes-learningsuite

![n8n](https://img.shields.io/badge/n8n-1.107.3+-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Eine n8n Community Node für die **LearningSuite API**, die es ermöglicht, deine LearningSuite Instanz nahtlos in n8n Workflows zu integrieren.

## Was ist n8n?

n8n ist ein einfach zu bedienendes Tool, mit dem du Aktionen zwischen verschiedenen Web-Apps, wie LearningSuite, automatisieren kannst. Das Erstellen von sogenannten "Workflows" zwischen Apps automatisiert viele der manuellen Aufgaben. So kannst du dir oder deinen Mitarbeitern enorm viel Zeit sparen.

## 🚀 Features

- **11 Ressourcen** vollständig unterstützt (Member, Course, Group, Bundle, Hub, Module, Community, Popup, Webhook, Role, API Call)
- **57+ Operationen** für maximale Flexibilität
- **Webhook Trigger** mit 11 Event-Types für Real-Time Automatisierung
- **TypeScript** Implementation für beste Entwicklererfahrung
- **Flexible API Call** Resource für custom Endpunkte

## 📋 Unterstützte Operationen

### 👤 **Member** (15 Operationen)
- Get by Email, Get by ID, Get All, Create, Update, Delete
- Activate/Deactivate, Add/Remove Courses, Add/Remove Bundles
- Get Courses, Get Course Info, Get Bundles, Find or Create

### 📚 **Course** (7 Operationen)
- Get Published, Get Modules, Get Modules for Member
- Get Members, Get Access Requests, Get Submissions, Create Lesson

### 👥 **Group** (11 Operationen)
- Get All, Create, Delete, Find by Name, Find or Create
- Add/Remove Members, Get/Add/Remove Courses, Add Bundles

### 📦 **Bundle** (2 Operationen)
- Get All, Get Members

### 🏠 **Hub** (5 Operationen)
- Get All, Get Templates, Create, Add/Remove Access

### 📖 **Module** (3 Operationen)
- Get Lessons, Get Sections, Create Unlock Override

### 💬 **Community** (2 Operationen)
- Get Areas, Get Forums

### 🎯 **Popup** (4 Operationen)
- Get All, Get, Trigger for Member, Remove Trigger for Member

### 🔗 **Webhook** (6 Operationen)
- Get/Create/Update/Delete Subscriptions, Get Sample Data

### 🛠️ **API Call** (1 Operation)
- Make Request (für beliebige API-Aufrufe)

## 🎣 Webhook Trigger Events

Der LearningSuite Trigger unterstützt folgende Events:

- ✅ **Lesson Completed** - Wenn eine Lektion abgeschlossen wird
- ✅ **Progress Changed** - Bei Fortschrittsänderungen
- ✅ **Feedback Created** - Neues Feedback erhalten
- ✅ **New Login** - Neuer Benutzer-Login
- ✅ **Exam Completed** - Prüfung abgeschlossen
- ✅ **Exam Graded** - Prüfung bewertet
- ✅ **Custom Popup Interaction** - Popup-Interaktion
- ✅ **Community Post Created** - Neuer Community-Post
- ✅ **Community Post Moderated** - Community-Post moderiert
- ✅ **Group User Access Changed** - Gruppenzugriff geändert
- ✅ **Member Not Logged In for X Days** - Benutzer inaktiv

## 💡 Beispiele für Anwendungsfälle

### Automatisierte Mitgliederverwaltung
Lege automatisiert von einer Liste wie in Google Sheets neue Mitglieder an und erspare dir so den Schritt, in LearningSuite manuell Nutzer anzulegen.

### E-Commerce Integration  
Verbinde andere Tools wie Copecart per Webhook mittels n8n und verkaufe deine LearningSuite Kurse in deinem eigenen Online-Shop.

### Lead-Generierung
Verknüpfe Formulare von deiner Website und gib Nutzern, welche das Formular ausfüllen, automatisiert Zugang zu Info-Produkten in LearningSuite.

### Fortschritts-Monitoring
Überwache automatisch den Lernfortschritt deiner Teilnehmer und sende personalisierte Erinnerungen oder Glückwünsche.

## 🛠️ Installation

### Option 1: n8n Community Nodes (Empfohlen)

1. Öffne deine n8n Instanz
2. Gehe zu **Settings** → **Community Nodes**
3. Installiere: `n8n-nodes-learningsuite`
4. Starte n8n neu

### Option 2: Manuelle Installation

```bash
# In deinem n8n Projekt-Verzeichnis
npm install n8n-nodes-learningsuite

# n8n neu starten
npm start
```

### Option 3: Docker

```bash
# Mit Docker Environment Variable
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_CUSTOM_EXTENSIONS="/data/custom" \
  -v ~/.n8n:/data \
  docker.n8n.io/n8nio/n8n
```

## 🔐 Authentifizierung einrichten

### API Key generieren

1. Melde dich in deiner **LearningSuite Instanz** an
2. Gehe zu **Einstellungen** → **Integrationen**
3. Klicke auf **"API-Key generieren"**
4. Kopiere den generierten API-Key

### Credentials in n8n konfigurieren

1. Öffne n8n und gehe zu **Credentials**
2. Klicke **"New Credential"**
3. Suche nach **"LearningSuite API"**
4. Fülle folgende Felder aus:
   - **API Key**: Dein generierter API-Key
   - **Base URL**: `https://api.learningsuite.io/api/v1` (Standard)
5. Teste die Verbindung und speichere

## 📖 Verwendung

### Basic Member Operation

```
1. Füge einen "LearningSuite" Node hinzu
2. Wähle Resource: "Member"
3. Wähle Operation: "Get by Email" 
4. Gib die E-Mail Adresse ein
5. Führe den Workflow aus
```

### Webhook Trigger Setup

```
1. Füge einen "LearningSuite Trigger" Node hinzu
2. Wähle das gewünschte Event (z.B. "Lesson Completed")
3. Konfiguriere optionale Filter
4. Aktiviere den Workflow
5. Der Webhook wird automatisch bei LearningSuite registriert
```

## 🔧 API Referenz

Die Node basiert auf der **LearningSuite API v1.9.0** und unterstützt alle öffentlich verfügbaren Endpunkte.

**Base URL**: `https://api.learningsuite.io/api/v1`

**Authentifizierung**: API Key über `x-api-key` Header

Vollständige API Dokumentation verfügbar unter: [LearningSuite API Docs](https://api.learningsuite.io/api/v1)

## 🤝 Contributing

Wir freuen uns über Beiträge! Bitte beachte folgende Guidelines:

### Development Setup

```bash
# Repository klonen
git clone https://github.com/redhat030/n8n-nodes-learningsuite.git
cd n8n-nodes-learningsuite

# Dependencies installieren
npm install

# TypeScript kompilieren
npm run build

# Tests ausführen
npm test
```

### Pull Request Guidelines

1. **Fork** das Repository
2. Erstelle einen **Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Committe** deine Änderungen (`git commit -m 'Add amazing feature'`)
4. **Push** zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen **Pull Request**

### Code Style

- TypeScript für alle neuen Features
- ESLint Konfiguration befolgen
- Tests für neue Funktionalität hinzufügen
- Dokumentation aktualisieren

## 📝 Changelog

### Version 1.0.0 (2025-08-23)

#### 🎉 Initial Release
- ✅ Vollständige LearningSuite API Integration
- ✅ 11 Ressourcen mit 57+ Operationen
- ✅ Webhook Trigger mit 11 Event-Types
- ✅ TypeScript Implementation
- ✅ Umfassendes Error Handling
- ✅ "Find or Create" Logik für Member und Groups
- ✅ Flexible Parameter-Konfiguration
- ✅ API Call Resource für custom Endpunkte

## 🛠️ Kompatibilität

- **n8n Version**: 1.107.3+ (getestet mit latest)
- **Node Version**: 14+ 
- **TypeScript**: 4.0+

## 📄 Lizenz

Dieses Projekt ist unter der [MIT Lizenz](LICENSE) lizenziert.

## ❓ Support

### Probleme melden
Für Bugs oder Feature Requests, bitte ein [GitHub Issue](https://github.com/redhat030/n8n-nodes-learningsuite/issues) erstellen.

### FAQ

**Q: Kann ich mehrere LearningSuite Instanzen verwenden?**  
A: Ja, erstelle einfach mehrere Credentials mit unterschiedlichen API Keys und Base URLs.

**Q: Werden alle API Endpoints unterstützt?**  
A: Die Node deckt alle öffentlichen API v1.9.0 Endpunkte ab. Für spezielle Endpunkte nutze die "API Call" Resource.

**Q: Wie finde ich meine LearningSuite API Base URL?**  
A: Die Standard URL ist `https://api.learningsuite.io/api/v1`. Bei Custom Domains kontaktiere deinen LearningSuite Administrator.

---

⭐ **Gefällt dir diese Node?** Gib uns einen Stern auf GitHub!

💡 **Feature Request?** Öffne ein Issue - wir sind immer offen für Verbesserungen!