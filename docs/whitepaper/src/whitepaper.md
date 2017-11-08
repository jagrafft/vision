---
title: vision White Paper
author: Jason A. Grafft
bibliography: './src/bib/library.bib'
csl: './src/bib/chicago-fullnote-bibliography.csl'
---
## Table of Contents
1. Introduction
2. Summary of Current Issues
    - Engineering and Technical
    - Patents and Ownership
    - Market Pressures
        - Closed Development Community
    - *{summary}*
3. Technical Considerations
    - Limited Ecosystem
        - FFmpeg
        - SQL/NoSQL
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
        - Databases
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
    - Escalation of Computational Overhead *{due to above items}*
        - Storage
            - Demands of Modern AV Formats
            - Challenges of Adaptive Streaming
                - Multiple Bit Rate Encodings
                - Manifests
                - File Management
                - *{see WebM wiki}*
            - Non-AV Data
                - Complexifying Datasets
                - Verbosity
                - Search Methods
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
Utilization of simulation-based training for healthcare providers has expanded rapidly since the early 2000's, when the first "high fidelity" patient simulator mannequins were made available by manufacturers at price points accessible to smaller programs. Over that time, simulation technology has diviersified considerably, lowering per-item cost while deepening the technology "stack" required for an appropriately-equipped laboratory.[^HighFidelity_comment] Though buy-in costs have remained high, the health education sector views simulation technology as valuable,[^cite] and there is growing evidence improved education outcomes are beginning to show across an increasing spectrum of psychomotor skills.[@Kennedy:2014:article][@McGaghie:2011:article][@McKinney:2013:article]

Audiovisual (AV) systems are an essential part of the technology stack for modern simulation laboratories; they are complex, expensive, specialized services which are difficult to maintain without access to a network or AV specialist. In addition to engineering challenges, the decoding, encoding, and transmission of AV data is deeply mired in a crytpic network of patent protections and proprietary technologies.[@Zimmerman:2017:online] Simulation laboratories in need of AV services have few options: select one of several commercially available products, contract for a customized system, or develop their own.

These items encourage vendor dependence, especially in resource limited laboratories, and increase the dfficulty of accurate decision-making by consumers. Vendors are not forthcoming on details related to the architecture, implementation, or performance of their service, and, if it is made available, the information is generally written in a marketing language that conflates and obfuscates technical details.[^Megapixel_comment]

Given that AV systems are an essential debriefing tool, and that debriefing is the most important part of simulation,[^cite] difficulty matching tool to task is likely to degrade Return on Investment (ROI) for a simulation laboratory and its constituents.

*vision*, an open-source data and audiovisual (AV) platform for medical simulation, offers a service-equivalent model for the capture and utilization of AV data in medical simulation laboratories. It is based on patent- and royalty-free technologies, implemented with modern architecture patterns, and targeted at commodity hardware. In all, *vision* lowers the cost-of-entry for simulation laboratories seeking an AV solution and provides a needed focal point for the medical simulation community to examine critical issues related to AV service.

## Summary of Current Issues
The AV marketplace is largely composed of small, specialized companies investigating problems of well-defined scope. By-and-large, however, market activity is directed by the small number of large companies with deep interests in AV transmission. This state likely owes to the blurry line between *technology which processes signals* and ownership of the *content encoded in those signals*. In brief, technology is used to sell content: the market for consumers of content exponentially larger than the market for specialized hardware and software, thus the bulk of revenue is available to the advertisers who use AV processing technology as an encapsulated service.

However, capture and delivery of AV data is decidedly *not* an encapsulated service; it relies on an extensive technology stack crossing many domains[^EngTechChal] that evolve independently and according to their own needs. Thus AV vendors are consumers and users of a wide range of technology products used to deliver a service to *their* customers, who implicitly "buy in" to these decisions when they deploy a given service. Though there is nothing inherently wrong with this practice, it is heavily obfuscated in marketing and sales materials, which focus on per-device specification and leave the buyer to discern whether their deployment environment can accommodate those devices *{REWORD}*. Given the cost and specificity of deploying an AV service within a medical simulation laboratory, consumers deserve a chance to review and question decisions ostensibly made on their behalf.

For convenience, this paper summarizes current issues and challenges facing developers and consumers of AV services using three broad categories of interest to both parties: *Engineering and Technical*, *Patents and Ownership*, and *Market Pressures*. It is the author's opinion the interaction of these categories accurately depicts the realities and peculiarities of the market vendors and consumers of AV services for medical simulation laboratories find themselves in. *vision* is built to make these issues clear, and address as many of them as is practical in an *open* and *collaborative* way.

### Engineering and Technical
The following table summarizes engineering and technical challenges to the development of an audiovisual service for medical simulation.

***{TABLE}***

### Patents and Ownership
Modern AV file formats developed in tandem with, and largely in service of, the expansion of digital 

### Market Pressures
Research and development of AV technology occurs in a niche market protective of Intellectual Property (IP) where there is no clear incentive for collaboration and large device manufacturers have considerable influence over standard adoption. Reporting in October 2017 for August 2017 data, market shares for Apple and Samsung were 35.0% and 35.2% respectively.[@KantarAppleMarketShare:2017:online] Several of Samsung's devices already support the High Efficiency Video Codec (HEVC), and Apple formally announced HEVC adoption for their devices in June of 2017.

## References

[^cite]: **THIS NEEDS A CITATION!!**
[^EngTechChal]: See *Engineering and Technical Challenges* below.
[^HighFidelity_comment]: Consider that in 2003, access to a mannequin such as SimMan (now SimMan Classic) *was the definition of* a "high fidelity" simulation program. Ten years later, a properly equipped program would have *one or more* "high fidelity" mannequins, several "mid"- and "low"- fidelity mannequins, dedicated simulation space, and an AV system able to capture at least one room.
[^Megapixel_comment]: As an example, see advertisers' use of megapixel calcuations for advertising digital cameras.