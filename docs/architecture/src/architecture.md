---
title: vision Architecture
author: Jason A. Grafft
bibliography: './architecture/src/bib/references.bib'
csl: './architecture/src/bib/chicago-fullnote-bibliography.csl'
---
# *vision* Service Architecture
## Table of Contents
1. Global Service Architecture
    1. External Communication
    2. Internal Communication
2. Microservices
    1. Master
    2. LogManager
    3. FileSystem
    4. Database
    5. AuthManager
    6. Capture
    7. Streaming
3. Traits
    1. Credentials
    2. Location

## Global Service Architecture
![vision Global Service Architecture][GlobalService]

The *vision* data service is an asynchronous, distributed system composed of independent microservices called Workers, who collaborate to deliver an end-user service. Users interact with a Master worker, responsible for activation, coordination, and oversight of all *vision* workers. Communication between the Master and other workers occurs at a level inaccessible to users, who are limited to making requests of the Master worker. A controlled, central access point helps normalize state across the distributed system, reducing the potential for bugs and errant behavior.

Each worker must be associated with a **local** LogManager (except other LogManagers), responsible for writing events to disk, providing read-only access for log requests, and pushing events to a distributed, eventual consistency data service.

### External Communication

### Internal Communication

## Microservices
*vision* microservices are independent, asynchronous services that provide methods to access the collection of system resources they represent. They are intended to be highly specialized, easily replicatable units which are literate in the communication protocols used by *vision*, and will often serve as a bridge between *vision* users and third-party services such as computing frameworks, databases, file formats, system processes, et cetera.

### Master
![Master Microservice Architecture][Master]

The Master microservice coordinates the effort of all *vision* workers, and serves as the sole point-of-contact for end users. All user requests are received and disseminated to *vision* workers at the discretion of the Master worker. The Master is allowed to hand off communication to other workers, thus providing implicit permission 

[GlobalService]: img/GlobalService.png
[AuthManager]: img/microservices/AuthManager.png
[Capture]: img/microservices/Capture.png
[Database]: img/microservices/Database.png
[FileSystem]: img/microservices/FileSystem.png
[LogManager]: img/microservices/LogManager.png
[Master]: img/microservices/Master.png
[Streaming]: img/microservices/Streaming.png
[Credentials]: img/traits/Credentials.png
[Location]: img/traits/Location.png