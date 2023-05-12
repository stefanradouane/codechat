# 💬 Code Chat

Repository voor de Code Chat applicatie.

Gemaakt door Stefan Radouane

Minor Web design and Development - 2022/2023

Real Time Web - Respository - Minor: Web Design and Development

## Inhoudsopgave

- [ℹ️ Over dit project](#ℹ️-over-dit-project)
- [📥 Project installatie](#📥-project-installatie)
- [🧠 Client-server rendering](#🧠-client-server-rendering)
- [👷 Service worker](#👷-service-worker)
- [🚑 App optimalisatie](#🚑-app-optimalisatie)
- [📝 Criteria](#📝-criteria)

## ℹ️ Over dit project

Dit project is gemaakt voor het vak Real Time Web. Bij dit vak is het de bedoeling dat ik een real time connectie maak tussen verschillende clients. De app moet uiteindlijk gedeployed worden op [Adaptable](https://adaptable.io). Ik maak bij dit project gebruik van twee soorten real time verbindingen, namelijk: WebSockets en WebRTC. De app die ik ga maken is een code chat app. De gebruikers kunnen met elkaar chatten en en code schrijven. De app is gemaakt met Node.js en Express. De app is gemaakt met de MVC structuur. De belangrijkste modules/packages die de app gebruikt zijn:

- [Node.js](https://nodejs.org/en/) | Server
- [Express](https://expressjs.com/) | Server
- [EJS](https://ejs.co/) | Templating
- [Passport](http://www.passportjs.org/) | Authenticatie
- [Socket.io](https://socket.io/) | Socket
- [Yjs](https://www.npmjs.com/package/yjs) | WebRTC
- [Y-WebRTC](https://www.npmjs.com/package/y-webrtc) | WebRTC
- [CodeMirror](https://codemirror.net/) | Editor

## 📥 Project installatie

Om dit project lokaal te runnen is moet je de volgende stappen achter elkaar uitvoeren in de terminal.

1. Clone repository met `git clone <repo-url>`
2. Navigeer naar de juiste map `cd <repo-naam>`
3. Installeer dependencies met `npm install` of `npm i`
4. Bouw de bestanden met `npm run build`
5. Start de server met `npm run start`
6. Open de app in de browser op `localhost:<port>` (standaard port is 4242)

### 🚧 Onderhoud

Om dit project te kunnen onderhouden is het de bedoeling dat je de bestanden opnieuw bouwt met het volgende command `npm run build`.

## 📱 Hoe werkt de app?

De app bestaat uit een aantal features. Ik heb de volgende features gemaakt, de features zijn op volgorde van de flow van de app:

- Login met passport.js
- Room selectie
- Code editor
- Chat
- Actieve gebruikers

### Login met passport.js

De gebruiker kan inloggen met passport.js. De gebruiker kan inloggen met zijn/haar voor- en achternaam als deze onderdeel uitmaakt van [whois fdnd api](https://whois.fdnd.nl/admin). De gebruiker wordt gecheckt en als de gebruiker gevonden wordt in de database dan wordt er een sessie aangemaakt in zowel de server als socket. De gebruiker wordt dan doorgestuurd naar de room selectie pagina. Ik heb hiervoor de authenticatie stategie `local` gebruikt. De gebruiker kan ook uitloggen. De gebruiker wordt dan uitgelogd uit de server en socket. De gebruiker wordt dan doorgestuurd naar de login pagina.

Om een sessie aan te maken in de server en socket heb ik gebruik gemaakt van de volgende code:

```javascript
// path: server.js

app.use(flash());

const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});
```

```javascript
// path: config/passport.js

// Code van de locale strategie
const LocalStrategy = new localStrategy(
  {
    usernameField: "name",
    passwordField: "surname",
  },
  (name, surname, done) => {
    fetch(
      `https://stefan-the-api-middleman.netlify.app/.netlify/functions/getUser/?name=${name}&surname=${surname}`
    )
      .then((res) => res.json())
      .then((users) => {
        // Geen gebruiker gevonden
        if (users.data.length === 0) {
          // Return flash message
          return done(null, false, {
            message: "Fout wachtwoord",
          });
          // Return user
        } else done(null, users.data[0]);
      })
      // Error
      .catch((err) => {
        return done(null, false, {
          message: "Probeer het nogmaals",
        });
      });
  }
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

passport.use(LocalStrategy);
```

> In de code kun je zien dat het endpoint een serverless functie die ik heb gemaakt en deployed op netlify. De functie haalt de gebruiker op uit de database.

Voor deze inlog functie heb ik de volgende modules/packages gebruikt:

- [Passport](http://www.passportjs.org/) | Authenticatie
- [Passport-local](http://www.passportjs.org/packages/passport-local/) | Authenticatie
- [socket.io](https://socket.io/) | Socket
- [express-session](https://www.npmjs.com/package/express-session) | Session
- [express-flash](https://www.npmjs.com/package/express-flash) | Flash messages
- [node-fetch](https://www.npmjs.com/package/node-fetch) | Fetch

### Room selectie

De gebruiker kan een room joinen door de naam van de room in te typen. De room wordt bepaald op basis van de query. Een voorbeeld hiervan is `?room=test`, de huidige roomnaam is dan test. Ik heb de volgende code gebruikt om te checken of de gebruiker in een room zit.

```javascript
res.render("pages/index", { room: req.query.room });
```

Dit wordt vervolgens afgehandeld in de ejs template.

```javascript
    <% if (room) { %>
    <%- include('../partials/users') %>
    <%- include('../partials/chat') %>
    <%- include('../partials/code-editor') %>
    <% } else { %>
    <%- include('../partials/roomselect') %>
    <% } %>
```

Ik heb de volgende modules/packages gebruikt voor de room selectie:

- [Express](https://expressjs.com/) | Server
- [EJS](https://ejs.co/) | Templating

### Code editor

De gebruiker kan code typen in de code editor. De code wordt realtime gesynchroniseerd met de andere gebruikers in de room. De code wordt gesynchroniseerd met [Yjs](https://www.npmjs.com/package/yjs) en [Y-WebRTC](https://www.npmjs.com/package/y-webrtc). Ik heb de volgende code gebruikt om de code te synchroniseren. Dit gedeelte bestaat uit drie onderdelen. Dit zijn:

- De code editor
- De Yjs document
- De Y-WebRTC provider

Ik heb gebruik gemaakt van CodeMirror voor de code editor. Ik heb de volgende code gebruikt om de code editor te initialiseren. Ik heb hiervoor een editor functie gemaakt die

```javascript
// path: src/js/editor.js

// maak een javascript editor aan
editor(`${name.name} ${name.surname}`, "js", theme, room);
```

Deze functie wordt aangeroepen vanuit een ander bestand.

```javascript
// path: src/js/editor-editor.js

const editor = (username, lang, theme, lobby) => {
  const ytext = ydocs[lang].getText(`${lobby}-${lang}`); // ydocs[lang] = new Y.Doc()
  const provider = providers[lang]; // providers[lang] = new WebrtcProvider("js", ydocs["js"], {})

  // Create a random color for the user and set it as the local state field "user"
  provider.awareness.setLocalStateField("user", {
    name: username,
    color: userColor.color,
    colorLight: userColor.light,
  });

  // Create a new editor view
  const editorState = (lang) => {
    return EditorState.create({
      doc: ytext.toString(), // ytext = ydocs[lang].getText(`${lobby}-${lang}`)
      extensions: [
        keymap.of([...yUndoManagerKeymap]), // yUndoManagerKeymap = [undo, redo]
        basicSetup, // basicSetup = [history(), keymap(), lineNumbers(), autocompletion()]
        syntaxHighlights[lang], // syntaxHighlights[lang] = javascript() | css() | html()
        EditorView.lineWrapping, // lineWrapping = true
        yCollab(ytext, provider.awareness), // allow collaboration
        theme == "default" ? [] : filteredThemes[theme], // select theme
      ],
    });
  };

  // Return editor with settings
  return new EditorView({
    state: editorState(lang),
    parent: document.querySelector(`.editor--${lang}`),
  });
};
```

> De code editor wordt geïnitialiseerd met de code van de gebruiker. De code wordt gesynchroniseerd met de andere gebruikers in de room.

Ik heb de volgende modules/packages gebruikt voor de code editor:

- [CodeMirror](https://codemirror.net/) | Code editor
- [HTML language support](https://www.npmjs.com/package/@codemirror/lang-html) | Code editor
- [CSS language support](https://www.npmjs.com/package/@codemirror/lang-css) | Code editor
- [Javascript language support](https://www.npmjs.com/package/@codemirror/lang-js) | Code editor
- [y-codemirror.next](https://www.npmjs.com/package/y-codemirror.next) | Code editor undomanager & collab
- [keymap](https://www.npmjs.com/package/@codemirror/state) | Code editor keymap
- [Yjs](https://www.npmjs.com/package/yjs) | WebRTC document
- [Y-WebRTC](https://www.npmjs.com/package/y-webrtc) | WebRTC

### Chat

De gebruiker kan chatten met de andere gebruikers in de room. De chat wordt realtime gesynchroniseerd met de andere gebruikers in de room. De chat wordt gesynchroniseerd met [socket.io](https://socket.io/). Ik heb de volgende code gebruikt om de chat te synchroniseren. Dit gedeelte bestaat uit twee onderdelen. Dit zijn:

- De chat
- De chat geschiedenis

Ik heb de volgende code gebruikt om de chat te initialiseren. Ik heb hiervoor een chat functie gemaakt die

```javascript
// path: src/js/chat.js
```
