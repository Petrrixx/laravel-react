# Laravel - Backend

Backend zadania je postavený na Laravel 11.6.1 a poskytuje REST API pre správu osôb. Dáta sú perzistentné a uložené v JSON súbore.

**API Endpointy:**
- **GET /api/users** – Vráti zoznam osôb
- **GET /api/users/search?query=...** – Vyhľadávanie osôb podľa mena, veku alebo pohlavia
- **DELETE /api/users/{id}** – Odstránenie osoby podľa ID
- **PUT /api/users/{id}** – Aktualizácia údajov osoby podľa ID

API routy sú definované v **routes/api.php** a server spúšťame príkazom:
```bash
php artisan serve
```

**Beží na:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
