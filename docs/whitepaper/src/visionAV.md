---
title: visionAV
author: Jason A. Grafft
bibliography: './src/bib/library.bib'
csl: './src/bib/chicago-fullnote-bibliography.csl'
---
## Table of Contents
1. Introduction
2. Problem Summary
    - Closed Development Community, Small Problem Space
        - *{see "Technical Considerations" below, summarize}*
    - Engineering and Technical Challenges
        - *{see "Technical Considerations" below, summarize}*
    - Legal Complexities
        - *{see "Technical Considerations" below, summarize}*
    - *{summary}*
3. Technical Considerations
    - Limited Ecosystem of Tools
        - Data Capture and Manipulation
            - FFmpeg
            - *{others...?}*
        - Codecs
            - H.264/HVEC/... *{dominance of}*
            - HTTP Live Streaming (HLS) *{Apple}*
            - WebM
                - VP9 *{Google}*
                - Opus
            - AV1 *{where does this fit?}*
        - Adaptive Bit Rate (ABR) Streaming
            - MPEG-DASH
            - Video on Demand (VOD)
    - Rapid, Independent Evolution of Technology Market
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
        - Codecs
            - MPEG-LA, HEVC Advance, Technicolor, Velos Media, ...
            - Wide Variance of Patent Laws
        - Content
            - Distributed Storage
            - Digital Rights Management (DRM)
            - Signatures
    - Escalation of Computational Overhead (due to above items)
        - Storage
            - Demands of ABR
                - Multiple Bit Rates
                - Manifests
                - *{see WebM wiki}*
        - Transmission
            - Asynchonous Transfer
            - Bandwidth
                - *{especially, changes in}*
            - Physical Configuration of Path
        - Hardware Specialization *{it's awkward trip to specialization via generic hardware}*
        - Coordination of Physically Distributed Services
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
    - Actor Model *{see \@LBWhyActors and related}*
        - Modular
        - Encapsulated Services
        - Rigorous Separation of Concerns
    - Open Standards
        - JSON
        - Akka *{[Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)}*
        - VP9/AV1/...
        - Opus
        - WebM
    - Open Source *{"Aligned" with Major Tools (Spark, Kafka, ...)}*
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

Audiovisual (AV) systems are an essential part of the technology stack for modern simulation laboratories; they are complex, expensive, specialized services which are difficult to maintain without access to a network or AV specialist. In addition to engineering challenges, the decoding, encoding, and transmission of AV data is deeply mired in a crytpic network of patent protections and proprietary technologies.[@Zimmerman:2017:online] Simulation laboratories in need of AV services have few options: select one of several commercially available products, contract for a customized system, or develop their own.

These items encourage vendor dependence, especially in resource limited laboratories, and increase the dfficulty of accurate decision-making by consumers. Vendors are not forthcoming on details related to the architecture, implementation, or performance of their service, and, if it is made available, the information is generally written in a marketing language that conflates and obfuscates technical details.[^fn2]

Given that AV systems are an essential debriefing tool, and that debriefing is the most important part of simulation,[^cite] difficulty matching tool to task is likely to degrade Return on Investment (ROI) for a simulation laboratory and its constituents.

*visionAV*, an open-source data and audiovisual (AV) platform for medical simulation, offers a service-equivalent model for the capture and utilization of AV data in medical simulation laboratories. It is based on patent- and royalty-free technologies, implemented with modern architecture patterns, and targeted at commodity hardware. In all, *visionAV* lowers the cost-of-entry for simulation laboratories seeking an AV solution and provides a needed focal point for the medical simulation community to examine critical issues related to AV service.


## References

[^cite]: **THIS NEEDS A CITATION!!**
[^fn1]: Consider that in 2003, access to a mannequin such as SimMan (now SimMan Classic) *was the definition of* a "high fidelity" simulation program. Ten years later, a properly equipped program would have *one or more* "high fidelity" mannequins, several "mid"- and "low"- fidelity mannequins, dedicated simulation space, and an AV system able to capture at least one room.
[^fn2]: As an example, see advertisers' use of megapixel calcuations for advertising digital cameras.