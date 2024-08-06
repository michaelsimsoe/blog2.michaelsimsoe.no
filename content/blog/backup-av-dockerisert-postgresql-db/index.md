---
title: Backup av Postgres fra docker
date: '2020-09-03T23:00:00.000Z'
updated: '2020-09-03T23:00:00.000Z'
description: 'Backup av dokerisert Posgresql database i et Ruby on Rails prosjekt og deretter importere tilbake data.'
slug: 'backup-av-dockerisert-postgresql-db'
tags:
  - postgresql
  - docker
  - devops
  - Ruby on Rails
published: true
# heroimage: ./images/webpack.png
---

# Backup og import av data med Posgresql og Docker

Trengte data fra produksjon og ned til utviklingsmiljøet. Trengte også å vite hvordan jeg kunen ta backup av databasen. Løste det slik:

### Logger på digitalocean droplet

```bash
docker exec <postgres_container_name> pg_dump -F t  -U postgres <database_name> > backup.tar
```

### Kopierer dump ned lokalt

```bash
rsync -avz <brukernavn>@<ip til droplet>:./backup.tar <der du vil ha den lokalt>
```

### Kopierer fil inn i kjørende db-container lokalt

```bash
docker cp <plassering lokalt> <containernavn/id>:/<plassering i container>
```

### Dropper db i rails og creater på nytt

<br />

### Kjører pg_restore i container

```bash
docker exec <containernavn> pg_restore -U <db brukernavn> -d <db navn> backup.tar
```
