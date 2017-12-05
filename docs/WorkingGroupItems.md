# *vision* Working Group Items

## Architecture/Design
- "Backpressure"
- "Circuit Breakers"
- Command Query Responsibility Separation (CQRS)
    - [Greg Young][young-cqrs]
    - [Martin Fowler][fowler-cqrs]
- Data flow
    - "Moving" data
    - "Resting" data
- [Event Sourcing][event-sourcing]
    - Creation of ["sagas"][sagas-paper] within logs (skim for concept)
- Eventual consistency
- Managing workers
    - Clarify role of Master worker
    - [Crash Only Software][crash-only]
    - Hierarchy of authority
- Service Discovery Layer
- Separation of concerns

## General
- Database, Filesystem, and LogManager moved to Classes (from Microservices)
    - I think this change will make these easier to use across the service
- Should we use Apache Kafka for record keeping?
    - Other, similar services?
    - Would replace Akka Distributed Data *for the task of logging*

[crash-only]: https://www.usenix.org/legacy/events/hotos03/tech/full_papers/candea/candea.pdf "Crash-Only Software"
[event-sourcing]: https://martinfowler.com/eaaDev/EventSourcing.html "Martin Fowler, Event Sourcing"
[fowler-cqrs]: https://martinfowler.com/bliki/CQRS.html "Martin Fowler, CQRS"
[sagas-paper]: http://www.amundsen.com/downloads/sagas.pdf "Sagas"
[young-cqrs]: http://codebetter.com/gregyoung/2010/02/16/cqrs-task-based-uis-event-sourcing-agh/ "CQRS, Task Based UIs, Event Sourcing agh!"