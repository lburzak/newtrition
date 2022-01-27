# Newtrition

## Instalacja
Przed przystąpieniem do uruchomienia należy zainstalować zależności:
```bash
yarn install
```

## Uruchamianie

### Backend

#### Docker
Cały backend można zainstalować w kontenerze Docker za pomocą `docker-compose`.

```bash
docker-compose -f backend-docker-compose.yml up
```

Usługa serwerowa zostaje wtedy dostępna pod adresem http://localhost:4000 i nie wymaga instalacji i konfiguracji bazy danych.

#### Instalacja manualna
Ta metoda wymaga istniejącej bazy MongoDB.

W zmiennych środowiskowych należy zapisać:
- Adres, na którym wystawiona jest usługa MongoDB.
- Port, na którym ma zostać wystawiona usługa serwerowa.

```bash
export MONGO_URI=mongodb://localhost:27017/newtrition
export PORT=4000
```

Następnie należy uruchomić usługę serwerową:
```bash
yarn runServer
```


### Frontend
Uruchomienie frontendu:
```bash
yarn runWeb
```