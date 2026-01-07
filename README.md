# CheckHTML - Repozitorij iz kolegija Praktikum DevOps (FIPU)

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

## Pristup aplikaciji

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

---

## Zaustavljanje aplikacije

```
docker compose down
```

Brisanje i volumena baze:

```
docker compose down -v
```
