# CheckHTML - Repozitorij projekta iz kolegija Praktikum DevOps (FIPU)

## Preduvjeti

Na računalu moraju biti instalirani:

- Docker
- Docker Compose

Provjera:

```
docker --version
docker compose version
```

---

## Pokretanje aplikacije (lokalno)

### 1. Kloniranje repozitorija

```
git clone https://github.com/JT07616/checkHTMLapp.git
cd checkHTMLapp
```

---

### 2. Kreiranje .env datoteka

U repozitoriju se nalaze .env.example datoteke koje služe kao predložak.

Potrebno ih je kopirati i preimenovati u .env

---

### 3. Pokretanje aplikacije pomoću Docker Composea

```
docker compose up --build
```

---

## Pristup servisima:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Grafana: http://localhost:3001  (user: `admin` | pass:`admin123`)
- Prometheus: http://localhost:9090
- cAdvisor: http://localhost:8081


---

## Zaustavljanje aplikacije

```
docker compose down
```

Brisanje volumena (potpuni reset podataka):

```
docker compose down -v
```
## Dokumentacija

Detaljna tehnička dokumentacija projekta (backend, worker, baza, Docker, monitoring i CI/CD) nalazi se unutar repozitorija u zasebnom dokumentu.
