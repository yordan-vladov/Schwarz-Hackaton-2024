![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.1-brightgreen?logo=spring) ![React Native](https://img.shields.io/badge/React%20Native-0.74.2-blue?logo=react)
# Finder
## Нужни инсталации
1. PostgreSQL 16
2. Maven
3. NodeJs

## Подкарване на PostgreSQL
За да може проекта да бъде стартиран трябва да има инициализирана база данни с името "hackathon".
```sh
sudo -u postgres psql 
CREATE DATABASE hackathon; 
```

## Подкарване на Spring
За стартиране на проекта трябва да бъдат зададени нужните параметри за връзка с базата данни. Те може да бъдат намерени в папката: "src/main/resources/application.yml".
```yaml 
spring:  
  datasource:  
    url: jdbc:postgresql://localhost:5432/hackathon  
    username: username  
    password: password
    driver-class-name: org.postgresql.Driver
```

Стартиране на Spring частта от проекта:
```sh
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-server -XX:+TieredCompilation -XX:TieredStopAtLevel=4 -XX:+UseParallelGC -Xms512m -Xmx1024m" 
```

## Подкарване на React Native
За стартиране на проекта е нужно в Node да бъдат инициализирани всички зависимости.
```sh
npm install
```
Стартиране на React Native частта от проекта:
```
npm start
```
