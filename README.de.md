
# n8n-nodes-learningsuite

  

![n8n](https://img.shields.io/badge/n8n-1.113.0+-brightgreen)

![Version](https://img.shields.io/badge/version-0.1.0-blue)

![License](https://img.shields.io/badge/license-MIT-green)

  

Eine n8n Community Node für die **LearningSuite API**, die es ermöglicht, deine LearningSuite Instanz nahtlos in n8n Workflows zu integrieren.

  

## Was ist n8n?

  

n8n ist ein einfach zu bedienendes Tool, mit dem du Aktionen zwischen verschiedenen Web-Apps, wie LearningSuite, automatisieren kannst. Das Erstellen von sogenannten "Workflows" zwischen Apps automatisiert viele der manuellen Aufgaben. So kannst du dir oder deinen Mitarbeitern enorm viel Zeit sparen.

  

## ⚖️ Rechtlicher Hinweis

  

Diese Community Node verwendet die öffentliche LearningSuite API und ist nicht mit LearningSuite verbunden oder von LearningSuite gesponsert. Alle Markenzeichen gehören ihren jeweiligen Eigentümern.

  

**Hinweis**: Dies ist eine von der Community entwickelte Node für die LearningSuite API. Für offiziellen Support wende dich bitte direkt an LearningSuite.

  

## 🚀 Features

  

-  **11 Ressourcen** vollständig unterstützt (Member, Course, Group, Bundle, Hub, Module, Community, Popup, Webhook, Role, API Call)
-  **Mehr als 62 Operationen** für maximale Flexibilität
- **Instant Trigger (Webhook-basierend)** mit 12 Event-Types für Echtzeit-Automatisierung
- **Polling Trigger** mit 8 Event-Types für zeitgesteuerte Abfragen
-  **Flexible API Call** Resource für custom Endpunkte

  

## 📋 Unterstützte Operationen

  

### 👤 **Member** (15 Operationen)

- Get by Email, Get by ID, Get All, Create, Update, Delete

- Activate/Deactivate, Add/Remove Courses, Add/Remove Bundles

- Get Courses, Get Course Info, Get Bundles, Find or Create

  

### 📚 **Course** (7 Operationen)

- Get Published, Get Modules, Get Modules for Member

- Get Members, Get Access Requests, Get Submissions, Create Lesson

  

### 👥 **Group** (12 Operationen)

- Add Bundles to Group, Add Courses to Group, Add Members to Groups, Add Members to Groups (Summary), Create Group, Delete Group, Find Group by Name, Find or Create Group, Get Group Courses, Get Many, Remove Courses From Group, Remove Members From Groups',
  

### 📦 **Bundle** (2 Operationen)

- Get All, Get Members

  

### 🏠 **Hub** (6 Operationen)

- Get All, Get Templates, Create, Add Access, Remove Access, Get Hub Template Variables

  

### 📖 **Module** (3 Operationen)

- Get Lessons, Get Sections, Create Unlock Override

  

### 💬 **Community** (5 Operationen)

- Assign Badges to Member, Get Community Areas, Get Community Badges, Get Community Forums, Remove Community Badges From Member

  

### 🎯 **Popup** (4 Operationen)

- Get All, Get Popup, Trigger for Member, Remove Trigger for Member

  

### 🔗 **Webhook** (6 Operationen)

- Get/Create/Update/Delete Subscriptions, Get Sample Data


### 🛠️ **Role** (1 Operation)

- Get All
  

### 🛠️ **API Call** (1 Operation)

- Make Request (für beliebige API-Aufrufe)

  

## 🎣 Webhook Trigger Events

  

Der LearningSuite Trigger unterstützt folgende Events:

## ⚡ Instant Trigger Events (Webhook)

- ✅ Community Post Created
- ✅ Community Post Moderated
- ✅ Course Progress Changed Above Threshold
- ✅ Custom Popup Interaction
- ✅ Exam Completed
- ✅ Exam Graded
- ✅ Group User Access Changed
- ✅ Lesson Completed
- ✅ New Access Request Created
- ✅ Feedback Created
- ✅ New Login
- ✅ Submission Created

## ⏱️ Polling Trigger Events

- ✅ Bundle Created (Polling Variante)
- ✅ Custom Popup Created (Polling Variante)
- ✅ Group Created (Polling Variante)
- ✅ New Community Area
- ✅ New Community Badge
- ✅ New Community Forum
- ✅ New Member
- ✅ Member Not Logged In for X Days
  

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

3. Installiere: `n8n-nodes-learningsuite` oder `@rjsebening/n8n-nodes-learningsuite`

4. Starte n8n neu
  

### Option 2: Manuelle Installation

#### A)

```bash
# In deinem n8n Projekt-Verzeichnis
npm  i  @rjsebening/n8n-nodes-learningsuite

# n8n neu starten
npm  start

```

#### B) Unscoped (Standard)

```bash

# In deinem n8n Projekt-Verzeichnis
npm  install  n8n-nodes-learningsuite

# n8n neu starten
npm  start

```

  

### Option 3: Docker

  

```bash

# Mit Docker Environment Variable

docker  run  -it  --rm  \

--name n8n \

-p  5678:5678  \

-e N8N_CUSTOM_EXTENSIONS="/data/custom" \

-v  ~/.n8n:/data  \

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

-  **API Key**: Dein generierter API-Key

-  **Base URL**: `https://api.learningsuite.io/api/v1` (Standard)

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

  

### ⚡ Instant Webhook Trigger Setup

  

```

1. Füge einen "LearningSuite Trigger" Node hinzu

2. Wähle das gewünschte Event (z.B. "Lesson Completed")

3. Konfiguriere optionale Filter

4. Aktiviere den Workflow

5. Der Webhook wird automatisch bei LearningSuite registriert

```

### ⏱️ Polling Trigger Setup

  

```

1. Füge einen "LearningSuite Polling Trigger" Node hinzu

2. Wähle das gewünschte Event (z.B. "New Member")

3. Konfiguriere optionale Filter

4. Aktiviere den Workflow

5. Der Polling Trigger wird automatisch bei LearningSuite registriert

```
  

## 🔧 API Referenz

  

Die Node basiert auf der **LearningSuite API** und unterstützt alle öffentlich verfügbaren Endpunkte.

  

**Base URL**: `https://api.learningsuite.io/api/v1`

  

**Authentifizierung**: API Key über `x-api-key` Header

  

Vollständige API Dokumentation verfügbar unter: [LearningSuite API Docs](https://api.learningsuite.io/api/v1/docs/)

  

## 🤝 Contributing

  

Wir freuen uns über Beiträge! Bitte beachte folgende Guidelines:

  

### Development Setup

  

```bash

# Repository klonen

git  clone  https://github.com/rjsebening/n8n-nodes-learningsuite.git

cd  n8n-nodes-learningsuite

  

# Dependencies installieren

npm  install

  

# TypeScript kompilieren

npm  run  build

  

# Tests ausführen

npm  test

```

  

### Pull Request Guidelines

  

1.  **Fork** das Repository

2. Erstelle einen **Feature Branch** (`git checkout -b feature/amazing-feature`)

3.  **Committe** deine Änderungen (`git commit -m 'Add amazing feature'`)

4.  **Push** zum Branch (`git push origin feature/amazing-feature`)

5. Öffne einen **Pull Request**

  

### Code Style

  

- TypeScript für alle neuen Features

- ESLint Konfiguration befolgen

- Tests für neue Funktionalität hinzufügen

- Dokumentation aktualisieren

  

## 📝 Changelog

  

### Version 0.1.0 (2025-09-23)

  

#### 🎉 Initial Release

- ✅ Vollständige LearningSuite API Integration

- ✅ 11 Ressourcen mit mehr als 62 Operationen

- ✅ Webhook Trigger mit 12 Event-Types für Echtzeit-Automatisierung

- ✅ Polling Trigger mit 8 Event-Types

- ✅ "Find-or-Create" Logik für Member und Groups

- ✅ Flexible Parameter-Konfiguration

- ✅ API Call Resource für custom Endpunkte

  

## 🛠️ Kompatibilität

  

-  **n8n Version**: 1.112.3+ (getestet mit latest)

-  **Node Version**: 20+

-  **TypeScript**: 5.0+

  

## 📄 Lizenz

  

Dieses Projekt ist unter der [MIT Lizenz](LICENSE) lizenziert.

  

## ❓ Support

  

### Probleme melden

Für Bugs oder Feature Requests, bitte ein [GitHub Issue](https://github.com/rjsebening/n8n-nodes-learningsuite/issues) erstellen.

  

### FAQ

  

**Q: Kann ich mehrere LearningSuite Instanzen verwenden?**

A: Ja, erstelle einfach mehrere Credentials mit unterschiedlichen API Keys und Base URLs.

  

**Q: Werden alle API Endpoints unterstützt?**

A: Die Node deckt alle öffentlichen API Endpunkte ab. Für spezielle Endpunkte nutze die "API Call" Resource.

  

**Q: Wie finde ich meine LearningSuite API Base URL?**

A: Die Standard URL ist `https://api.learningsuite.io/api/v1`. Bei Custom Domains kontaktiere deinen LearningSuite Administrator.

  

---

  

⭐ **Gefällt dir diese Node?** Gib uns einen Stern auf GitHub!

  

💡 **Feature Request?** Öffne ein Issue - wir sind immer offen für Verbesserungen!

  

## 📋 Haftungsausschluss

  

Diese inoffizielle Community Node ist nicht mit LearningSuite verbunden, von LearningSuite unterstützt oder gesponsert. Sie nutzt ausschließlich die öffentlich verfügbare LearningSuite API gemäß deren Nutzungsbedingungen.

  

**Wichtige Hinweise:**

- Diese Node wird von der Community entwickelt und gepflegt

- Für Probleme mit der LearningSuite API wende dich an den offiziellen LearningSuite Support

- Alle LearningSuite Markenzeichen und Logos gehören LearningSuite

- Diese Node stellt lediglich eine Schnittstelle zur öffentlichen API dar