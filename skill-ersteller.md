---
name: skill-builder
description: Verwenden, wenn neue Skills erstellt, bestehende Skills optimiert oder die Qualität eines Skills überprüft werden sollen. Führt die Skill-Entwicklung gemäß den offiziellen Claude Code Best Practices.
---

## Was dieser Skill macht

Leitet die Erstellung und Optimierung von Claude Code Skills anhand offizieller Best Practices. Verwende diesen Skill immer dann, wenn:

- Ein neuer Skill von Grund auf erstellt wird
- Ein bestehender Skill optimiert oder überprüft wird
- Erweiterte Features entschieden werden sollen (Subagent-Ausführung, Hooks, dynamischer Kontext usw.)
- Ein Skill nicht korrekt funktioniert und Fehler behoben werden müssen

Für die vollständige technische Referenz zu allen Frontmatter-Feldern, erweiterten Mustern und Troubleshooting siehe [reference.md](reference.md).

---

## Schnellstart: Was ist ein Skill?

Ein Skill ist ein wiederverwendbarer Satz von Anweisungen, der Claude Code erklärt, wie eine bestimmte Aufgabe ausgeführt werden soll. Skills befinden sich in `.claude/skills/[skill-name]/SKILL.md` innerhalb deines Projekts. Wenn du `/skill-name` eingibst oder deine Aufgabe in natürlicher Sprache beschreibst, lädt Claude die Skill-Anweisungen und führt sie aus.

Betrachte Skills als SOPs für Claude. Statt einen Workflow in jeder Unterhaltung erneut zu erklären, schreibst du ihn einmal und kannst ihn dauerhaft verwenden.

**So funktionieren sie intern:**
- Die Anweisungen in `CLAUDE.md` deines Projekts werden immer geladen – in jeder Unterhaltung.
- Skill-Beschreibungen (aus dem Frontmatter) werden ebenfalls immer geladen, damit Claude weiß, welche Skills verfügbar sind.
- Der vollständige Skill-Inhalt wird erst geladen, wenn der Skill tatsächlich verwendet wird.
- Sobald geladen, folgt Claude den Skill-Anweisungen und respektiert weiterhin die Regeln aus `CLAUDE.md`.

---

## Modus 1: Einen neuen Skill erstellen

Wenn du einen neuen Skill erstellst, führe zuerst das **Discovery Interview** durch. Beginne **nicht** mit dem Schreiben von Dateien, bevor die Discovery abgeschlossen ist.

### Discovery Interview

Stelle Fragen mit `AskUserQuestion`, eine Runde nach der anderen. Jede Runde behandelt ein Thema. Fahre erst mit der nächsten Runde fort, nachdem der Nutzer geantwortet hat. Fahre fort, bis du zu mindestens 95 % sicher bist, dass du den Skill ohne weitere Rückfragen erstellen kannst.

#### Runde 1: Ziel & Name
*Warum das wichtig ist: Ein klares Ziel verhindert Scope Creep. Der Name wird zum `/slash-command`, daher muss er einprägsam und spezifisch sein.*

- Was macht dieser Skill? Welches Problem löst er oder welchen Workflow automatisiert er?
- Wie sollen wir ihn nennen? (Schlage einen Namen auf Basis der Antwort vor – kleingeschrieben, mit Bindestrichen, maximal 64 Zeichen.)

#### Runde 2: Trigger
*Warum das wichtig ist: Das Feld `description` entscheidet, ob Claude den Skill lädt. Schlechte Trigger-Wörter führen dazu, dass der Skill nie verwendet wird. Zu breite Formulierungen führen dazu, dass Claude ihn auslöst, obwohl du es nicht willst.*

- Was würde jemand sagen, um diesen Skill auszulösen? (Erfrage 2–3 natürliche Formulierungen.)
- Soll er nur vom Nutzer per `/slash-command`, automatisch durch Claude oder auf beide Arten ausgelöst werden?
- Akzeptiert er Argumente? Wenn ja, welche? (Zum Beispiel ein Thema, eine URL oder einen Dateipfad.)

#### Runde 3: Schritt-für-Schritt-Prozess
*Warum das wichtig ist: Claude folgt Anweisungen wörtlich. Vage Schritte erzeugen vage Ergebnisse. Präzise Schritte erzeugen konsistente Resultate.*

- Beschreibe genau, was vom Trigger bis zum Output passieren soll. Was ist Schritt 1? Schritt 2? Fahre fort.
- Führt Claude jeden Schritt selbst aus oder delegiert er an einen Subagenten oder ein Skript?
- Muss der Prozess konversationell sein oder ist er eine Fire-and-Forget-Aufgabe?

#### Runde 4: Inputs, Outputs & Abhängigkeiten
*Warum das wichtig ist: Skills ohne klar definierte Inputs und Outputs erzeugen inkonsistente Resultate. Saubere Definitionen machen den Skill zuverlässig.*

- Welche Inputs benötigt der Skill? (Dateien, API-Antworten, Nutzerargumente, Live-Daten)
- Was erzeugt er? (Dateien, Textausgaben, strukturierte Daten) Wohin gehen die Outputs?
- Benötigt er externe APIs, Skripte oder Tools? Welche?
- Benötigt er Referenzdateien, Stilrichtlinien, Templates oder Beispiele?

#### Runde 5: Guardrails & Edge Cases
*Warum das wichtig ist: Skills ohne Guardrails können unerwartetes Verhalten erzeugen – falsche Outputs, unnötige API-Kosten oder nicht beabsichtigte Aktionen.*

- Was könnte schiefgehen? Was sind typische Fehlerfälle?
- Was darf dieser Skill **nicht** tun? Gibt es harte Grenzen?
- Gibt es Kostenbedenken? (API-Aufrufe, KI-Bildgenerierung usw.)
- Gibt es Reihenfolge- oder Abhängigkeitsregeln? (Zum Beispiel: „X muss geprüft werden, bevor Y passiert.“)

#### Runde 6: Bestätigung
*Warum das wichtig ist: Missverständnisse, die hier erkannt werden, ersparen dir später Neuaufbau.*

Fasse dein Verständnis in diesem Format zusammen:

```markdown
## Skill-Zusammenfassung: [name]

**Ziel:** [ein Satz]
**Trigger:** `/name` + [natürliche Sprachphrasen]
**Argumente:** [was akzeptiert wird, oder „keine“]

**Prozess:**
1. [Schritt]
2. [Schritt]
...

**Inputs:** [was gelesen/benötigt wird]
**Outputs:** [was erzeugt wird + Speicherort]
**Abhängigkeiten:** [APIs, Skripte, Agents, Referenzdateien]
**Guardrails:** [was schiefgehen kann, was zu vermeiden ist]
```

Frage anschließend: „Erfasst das alles korrekt? Möchtest du etwas ergänzen oder ändern?“
Fahre erst mit dem Build fort, wenn der Nutzer bestätigt.

**Runden überspringen:** Wenn der Nutzer von Anfang an genug Kontext liefert, überspringe bereits beantwortete Runden. Frage nichts erneut, was du schon weißt.

### Build-Phase

Sobald die Discovery abgeschlossen ist, erstelle den Skill anhand dieser Schritte:

#### Schritt 1: Skill-Typ wählen

- **Task Skills** (am häufigsten) geben Schritt-für-Schritt-Anweisungen für eine konkrete Aktion. Sie werden per `/name` oder natürlicher Sprache aufgerufen. Beispiele: Bericht erzeugen, PR zusammenfassen, Code deployen.
- **Reference Skills** liefern Wissen, das Claude auf aktuelle Arbeit anwenden soll, ohne selbst eine Aktion auszuführen. Beispiele: Coding Conventions, API-Muster, Styleguides.

#### Schritt 2: Frontmatter konfigurieren

Setze diese Felder basierend auf der Discovery:

- `name` – muss zum Verzeichnisnamen passen. Kleingeschrieben, mit Bindestrichen, maximal 64 Zeichen.
- `description` – formuliere es so: „Use when someone asks to [action], [action], or [action].“ Verwende natürliche Keywords aus den Trigger-Phrasen.
- `disable-model-invocation: true` – setzen, wenn der Skill Side Effects hat (Dateien erzeugt, APIs aufruft, Geld kostet). Verhindert automatische Auslösung durch Claude.
- `argument-hint` – setzen, wenn der Skill Argumente akzeptiert. Wird im `/`-Menü als Hinweis angezeigt.
- `context: fork` + `agent` – setzen, wenn der Skill eigenständig ist und keinen Gesprächsverlauf benötigt.
- `model` – setzen, wenn spezielle Modellfähigkeiten erforderlich sind.
- `allowed-tools` – setzen, wenn der Skill nur eingeschränkten Toolzugriff haben soll.

Setze nur Felder, die wirklich benötigt werden. Ergänze kein Frontmatter ohne konkreten Nutzen.

Für die vollständige Feldreferenz und die Invocation-Control-Matrix siehe [reference.md](reference.md).

#### Schritt 3: Skill-Inhalt schreiben

Strukturiere Task Skills so:
1. **Context** – Welche Dateien zu lesen sind, welche APIs aufzurufen sind, welches Referenzmaterial geladen werden soll.
2. **Schritt-für-Schritt-Workflow** – Nummerierte Schritte. Jeder Schritt beschreibt exakt, was Claude tun soll.
3. **Output Format** – Wie das Ergebnis aussieht. Einschließlich Templates, Dateipfade, strukturierte Formate.
4. **Notes** – Edge Cases, Einschränkungen, Delegation, Dinge, die **nicht** getan werden sollen.

Regeln für den Inhalt:
- Halte `SKILL.md` unter 500 Zeilen. Ausführliches Referenzmaterial gehört in unterstützende Dateien.
- Verwende `$ARGUMENTS` / `$N` für dynamische Eingaben.
- Verwende `!command` für dynamische Kontextinjektion (Preprocessing).
- Sei präzise bei Agent-Delegation – gib den exakten Prompt-Text an.
- Gib alle Dateipfade an (Inputs, Outputs, Skripte, Referenzen).

#### Schritt 4: Unterstützende Dateien hinzufügen

Wenn dein Skill detaillierte Referenzdokumente, Beispiele oder Skripte benötigt, lege sie neben `SKILL.md` im selben Verzeichnis ab. Verweise in `SKILL.md` darauf, damit Claude weiß, dass sie existieren. Unterstützende Dateien werden **nicht** automatisch geladen – nur dann, wenn Claude sie braucht. Das vollständige Muster findest du in [reference.md](reference.md).

#### Schritt 5: In `CLAUDE.md` dokumentieren

Die Datei `CLAUDE.md` deines Projekts enthält projektweite Anweisungen, die in jeder Unterhaltung geladen werden. Nachdem du einen Skill erstellt hast, füge dort einen kurzen Eintrag hinzu, damit du und dein Team wisst, was verfügbar ist:

- Skill-Name und `/slash-command`
- Trigger-Phrasen
- kurze Beschreibung der Funktion
- Output-Ort (wenn Dateien erzeugt werden)

Das ist nicht zwingend erforderlich, aber es hält dein Projekt organisiert und hilft Claude, Skills im Gesamtkontext deines Workflows zu verstehen.

#### Schritt 6: Testen

Teste beide Auslösearten:

1. **Natürliche Sprache** – Formuliere eine Anfrage passend zur Beschreibung. Lädt Claude den Skill?
   - Falls nicht, überarbeite das Feld `description`, sodass die verwendeten Keywords darin vorkommen.
   - Teste 2–3 verschiedene Formulierungen, um die Zuverlässigkeit zu prüfen.
2. **Direkter Aufruf** – Führe `/skill-name` mit Testargumenten aus.
   - Prüfe, ob `$ARGUMENTS` / `$N` korrekt ersetzt werden.
   - Prüfe, ob Outputs an der erwarteten Stelle landen.
3. **Edge Cases** – Probiere fehlende Argumente, ungewöhnliche Inputs oder leeren Input aus.
4. **Zeichenbudget** – Wenn du viele Skills hast, verwende `/context`, um zu prüfen, ob die Beschreibung deines Skills geladen wird. Falls nicht, überschreitet die Summe der Beschreibungen womöglich das Budget (siehe [reference.md](reference.md)).

Wenn Probleme auftreten, siehe Troubleshooting in [reference.md](reference.md).

### Vollständiges Beispiel

Hier ist ein minimales, aber vollständiges Beispiel als Starttemplate:

**Datei:** `.claude/skills/meeting-notes/SKILL.md`

```yaml
---
name: meeting-notes
description: Use when someone asks to summarize meeting notes, recap a meeting, or format meeting minutes.
argument-hint: [topic or date]
---
```

## What This Skill Does

Takes raw meeting notes and produces a structured summary with action items.

## Steps

1. Ask the user to paste their raw meeting notes (or provide a file path).
2. Extract the following from the notes:
   - **Attendees** – Who was in the meeting
   - **Key decisions** – What was decided
   - **Action items** – Who owes what, with deadlines if mentioned
   - **Open questions** – Anything unresolved
3. Format the output using the template below.
4. If `$ARGUMENTS` is provided, use it as the meeting title. Otherwise, infer a title from the content.

## Output Template

# Meeting: [title]
**Date:** [date if mentioned, otherwise "Not specified"]
**Attendees:** [comma-separated list]

## Key Decisions
- [decision]

## Action Items
- [ ] [person]: [task] (due: [date or "TBD"])

## Open Questions
- [question]

## Notes

- Keep summaries concise. Don't add commentary or embellish.
- If notes are too vague to extract action items, flag that to the user instead of making them up.

---

## Modus 2: Einen bestehenden Skill prüfen

Verwende diese Checkliste, um einen bestehenden Skill zu überprüfen. Lies die Skill-Datei zuerst vollständig, bevor du die Checkliste durchgehst. Behebe Probleme, bevor du die Prüfung als abgeschlossen markierst.

### Frontmatter-Prüfung

- [ ] `name` stimmt mit dem Verzeichnisnamen überein
- [ ] `description` verwendet natürliche Keywords, die jemand tatsächlich sagen würde, wenn er diesen Skill braucht
- [ ] `description` ist spezifisch genug, um Fehltrigger zu vermeiden, aber breit genug, um echte Anfragen zu erfassen
- [ ] `disable-model-invocation: true` ist gesetzt, wenn der Skill Side Effects hat (Dateien erzeugt, APIs aufruft, Nachrichten sendet, Geld kostet)
- [ ] `argument-hint` ist gesetzt, wenn der Skill Argumente via `/name` akzeptiert
- [ ] `allowed-tools` ist gesetzt, wenn der Skill **nicht** auf alle Tools zugreifen soll
- [ ] `context: fork` wird verwendet, wenn der Skill eigenständig ist und ausführliche Ausgaben produziert
- [ ] `model` ist nur gesetzt, wenn spezielle Modellfähigkeiten erforderlich sind
- [ ] Keine unnötigen Felder gesetzt

### Inhaltsprüfung

- [ ] `SKILL.md` ist insgesamt unter 500 Zeilen (detaillierte Referenzen in unterstützenden Dateien ausgelagert)
- [ ] Klarer Schritt-für-Schritt-Workflow mit nummerierten Schritten (für Task Skills)
- [ ] Output-Format mit Templates oder Beispielen angegeben
- [ ] Alle Dateipfade und Speicherorte dokumentiert
- [ ] Agent-Delegationsanweisungen enthalten den tatsächlichen Prompt-Text
- [ ] Notes-Abschnitt deckt Edge Cases, Einschränkungen und Verbote ab
- [ ] Keine vagen Anweisungen – jeder Schritt sagt Claude exakt, was zu tun ist
- [ ] String-Substitutionen (`$ARGUMENTS`, `$N`) werden dort verwendet, wo der Skill Input akzeptiert

### Integrationsprüfung

- [ ] Skill ist in `CLAUDE.md` dokumentiert (empfohlen, nicht erforderlich)
- [ ] Unterstützende Dateien (falls vorhanden) sind aus `SKILL.md` referenziert und nicht verwaist
- [ ] Skripte (falls vorhanden) haben korrekte Dateipfade und sind ausführbar
- [ ] API-Keys (falls vorhanden) liegen in Umgebungsvariablen, niemals hartkodiert

### Qualitätsprüfung

- [ ] Ein Anfänger könnte die Anweisungen ohne Vorwissen befolgen
- [ ] Die Anweisungen sind konkret und umsetzbar, nicht abstrakt
- [ ] Delegiert bei Bedarf an Subagents, um den Hauptkontext sauber zu halten
- [ ] Dupliziert keine Informationen, die bereits anderswo existieren (`CLAUDE.md`, andere Skills)
- [ ] Output-Pfade folgen einer vorhersehbaren Konvention

### Optimierungsmöglichkeiten

Nach der Prüfung siehe [reference.md](reference.md) für erweiterte Features, die den Skill verbessern könnten: `context: fork`, `allowed-tools`, dynamische Kontextinjektion, Hooks und unterstützende Dateien.

---

## Empfohlene Konventionen

Passe diese an dein Projekt an:

- Skills liegen in `.claude/skills/[skill-name]/SKILL.md`
- Output-Dateien landen an einem vorhersagbaren Ort (zum Beispiel `output/[skill-name]/`)
- API-Keys gehören in Umgebungsvariablen, niemals in Skill-Dateien
- Dokumentiere alle aktiven Skills in `CLAUDE.md`
- Das Frontmatter-Feld `description` wird so formuliert: „Use when someone asks to [action], [action], or [action].“

## Wichtige Hinweise

- Lies einen bestehenden Skill immer zuerst, bevor du ihn optimierst. Schlage niemals Änderungen für einen Skill vor, den du nicht gelesen hast.
- Prüfe beim Erstellen eines neuen Skills, ob bereits ein ähnlicher Skill existiert, der erweitert werden könnte.
- Für erweiterte Muster (Subagent-Ausführung, Hooks, Berechtigungen) siehe [reference.md](reference.md).
