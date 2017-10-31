---
title: visionAV
author: Jason A. Grafft
bibliography: './src/bib/library.bib'
csl: './src/bib/chicago-fullnote-bibliography.csl'
---
## Table of Contents
1. Introduction
2. Problem Summary
    - Engineering and Technical Challenges
    - Closed Development Community, Shared Problem Space
        - FFmpeg
        - Escalation of Bandwidth Demand
        - Adaptive Bit Rate (ABR)
        - Highly Variable Consumer Device Market
    - Legal Complexities
        - MPEG-LA
        - Wide Variance of Patent Laws
    - *{summary}*
3. Technical Considerations
    - Rapid, Independent Evolution of Foundational Technologies
        - Digital Audio and Video
            - Purpose-built Codecs
            - Patent and Royalty Issues
            - Support Among Consumer Devices
        - Encryption
        - Web Browsers
        - File storage
    - Proliferation of Audiovisual "Innovations"
        - Formats
            - 360° video
            - High/Ultrahigh/... Definition
            - Virtual Reality
        - Processing
            - Augmented Reality
            - Deidentification
            - Motion (video)
            - Natural Language (audio)
        - Legal
            - Distributed Storage
            - Digital Rights Management (DRM)
            - Signatures
    - Security
        - Complexities Introduced by Physical Distribution
        - Access to Nodes
        - Encryption and Encryptability
        - User Authentication
4. Meeting Needs and Addressing Challenges
    - Technology-agnostic Framework
        - (Service) Broker
        - Node-based Architecture
        - Data as a First-Order Citizen
        - Avoids (Explicit and Implicit) Vendor Lock-In
    - Modular
        - Actor Model
        - Rigorous Separation of Concerns
            - Encapsulated Services
    - Open Standards
        - JSON
        - *{actor model library}*
        - VP9/AV1/...?
        - Opus
        - WebM?
    - Open Source
        - *{"Aligned" with Major Tools (Spark, Kafka, ...)}*
        - Community-Driven
        - Fully Reviewable (security)
        - Modafiable
    - Robust Testing Framework
        - Network Loading
        - Reference Datasets
        - Stream Performance
    - Patent and Royalty Free
5. Conclusion
    - *{algined with open source tools}*
    - *{avoids vendor/platform (clear up) lock-in}*
    - *{inclusiveness ("community aware")}*
    - *{increases visibility of difficult engineering issues}*
    - *{fundamentally different motivations}*

## Introduction
Utilization of simulation-based training for healthcare providers has expanded rapidly since the early 2000's, when the first "high fidelity" patient simulator mannequins were made available by manufacturers at price points accessible to smaller programs. Over that time, simulation technology has diviersified considerably, lowering per-item cost while deepening the technology "stack" required for an appropriately-equipped laboratory.[^fn1] Though buy-in costs have remained high, the health education sector views simulation technology as valuable,[^cite] and there is growing evidence improved education outcomes are beginning to show across an increasing spectrum of psychomotor skills.[@Kennedy:2014:article][@McGaghie:2011:article][@McKinney:2013:article]

Audiovisual (AV) systems are an essential part of the technology stack for modern simulation laboratories. They are complex, expensive, specialized services that are difficult to maintain without access to a network or AV specialist, and simulation laboratories in need of AV services have few options: select one of several commercially available products, contract for a customized system, or develop their own. These items encourage vendor dependence, especially in resource limited laboratories, and increase the dfficulty of accurate decision-making by consumers. Given that AV systems are an essential debriefing tool, and that debriefing is the most important part of simulation,[^cite] difficulty matching tool to task is likely to degrade Return on Investment (ROI) for a simulation laboratory and its constituents.

*visionAV*, an open-source data and audiovisual (AV) platform for medical simulation, 

## Problem Summary


## References

[^cite]: **THIS NEEDS A CITATION!!**
[^fn1]: Consider that in 2003, access to a mannequin such as SimMan (now SimMan Classic) *was the definition of* a "high fidelity" simulation program. Ten years later, a properly equipped program would have *one or more* "high fidelity" mannequins, several "mid"- and "low"- fidelity mannequins, dedicated simulation space, and an AV system able to capture at least one room.