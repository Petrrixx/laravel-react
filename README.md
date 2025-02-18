### Laravel - Backend

Backend zadania je postavený na Laravel 11.6.1 a poskytuje REST API pre správu osôb. Dáta sú perzistentné a uložené v JSON súbore.

**API Endpointy:**
- **GET /api/users** – Vráti zoznam osôb
- **GET /api/users/search?query=...** – Vyhľadávanie osôb podľa mena, veku alebo pohlavia
- **DELETE /api/users/{id}** – Odstránenie osoby podľa ID
- **PUT /api/users/{id}** – Aktualizácia údajov osoby podľa ID

API routy sú definované v **routes/api.php** a server spúšťame príkazom:
```bash
cd backend
php artisan serve
```

**Beží na:** [http://127.0.0.1:8000](http://127.0.0.1:8000)

### React - Frontend

Frontend pre jednoduchú webovú aplikáciu vytvorenú v React-e, ktorá zobrazuje tabuľku osôb s parametrami: **id**, **meno**, **vek** a **pohlavie**.

**Funkcionality:**
- Zobrazenie zoznamu osôb (AJAX GET)
- Vyhľadávanie osôb podľa mena, veku a pohlavia (AJAX GET)
- Editácia údajov osoby (AJAX PUT)
- Odstránenie osoby (AJAX DELETE)

Aplikácia používa Axios pre AJAX požiadavky a Bootstrap pre štýlovanie.

**Pre spustenie som používal:**
```bash
cd frontend
npm start
```

**Beží na:** [http://localhost:3000](http://localhost:3000)

**Použité zdroje:**
- **https://axios-http.com/docs/api_intro**
- **https://getbootstrap.com/docs/5.3/getting-started/introduction/**
- **https://stackoverflow.com/questions/73825840/laravel-csrf-token-mismatch-post-request-from-seperate-react-project**
- **https://blog.treblle.com/how-to-create-rest-api-using-laravel/**