---
title: vision
subtitle: sUbtiTlE hErE (suGgeStiOnS?)
author: Jason A. Grafft
bibliography: './whitepaper/src/bib/references.bib'
csl: './whitepaper/src/bib/chicago-fullnote-bibliography.csl'
---
## Table of Contents
1. Introduction
2. Engineering Challenges
    - User Experience (UX)
    - Limited Ecosystem of Essential Technologies
    - Security
    - Globally Escalating Computational Overhead
3. Barries to Competetion
    - Minority Control of Market
    - Patents and Ownership
4. *vision*: Addressing Challenges and Removing Barriers

## Introduction
Utilization of simulation-based training for healthcare providers has expanded rapidly since the early 2000's, when the first "high fidelity" patient simulator mannequins were made available by manufacturers at price points accessible to smaller programs. Over that time, simulation technology has diviersified considerably, lowering per-item cost while deepening the "stack" required for an appropriately-equipped laboratory.[^high-fidelity-comment] Though buy-in costs have remained high, the health education sector views simulation technology as valuable,[@Cook:2011:article] and there is accumulating evidence of improved education outcomes from simulation training across an increasing spectrum of psychomotor skills.[@McGaghie:2011:article][@McKinney:2013:article][@Kennedy:2014:article]

Data capture systems are an essential part of the technology stack for modern simulation laboratories; they are complex, expensive, specialized services which are difficult to maintain without access to a specialist. In addition to engineering challenges, the decoding, encoding, and transmission of AV data is deeply mired in a crytpic network of patent protections and proprietary technologies.[@Zimmerman:2017:online] Simulation laboratories in need of AV services have few options: select one of several commercially available products, contract for a customized system, or develop their own. Each option introduces significant up-front and downstream costs, and the latter two are not realistic for a majority of simulation centers.

These items encourage vendor dependence, especially in resource limited laboratories, and increase the dfficulty of accurate decision-making by consumers. Vendors are not forthcoming on details related to the architecture, implementation, or performance of their service, and, if it is made available, the information is written in a marketing language that conflates and obfuscates important technical details.[^megapixel-comment] Given that AV systems are an essential debriefing tool, and that debriefing is the most important part of simulation,[@Issenberg:2005:article][@Sawyer:2016:article] difficulty matching tool to task degrades Return on Investment (ROI) for simulation laboratories and their constituents.

*vision* is an asynchronous, distributed, open-source data system for medical simulation built with reactive microservices. It offers a service-equivalent model for the capture and utilization of AV data in medical simulation laboratories, then expands this model to accomodate modern data technologies. It is based on patent- and royalty-free technologies, implemented with state-of-the-art architecture patterns, and targeted at commodity hardware. In all, *vision*

1. Lowers the cost-of-entry for simulation laboratories seeking a data and AV service.
2. Provides a needed focal point for the medical simulation community to examine critical issues related to these services.
3. Allows simiulation laborities to meet *their own* needs by providing robust, flexible, and extensible interfaces for emerging technologies.

Moving forward, some nomenclature will be helpful.

- *Distributed Systems* are a collections of indepdent computers that appear to their users as a single system.
- *Reactive Microservices* are autonomous, self-contained programs that interact asychronously at the request of another service. They communicate via protocols, and may be many miles apart.
- *Formats* are containers for data. Audiovisual formats contain data such as audio tracks, subtitles, and image streams.
- *Codecs* are used to compress (encode) and decompress (decode) formats, reducing file size and improving the efficiency of transmitting data. They are highly specific algorithms and must be carefully paired with a use case.
    - *Encoders* compress data for storage or transmission.
    - *Decoders* decompress data for viewing.

## Engineering Challenges
Capture and delivery of distrubted data is *not* an encapsulated service, despite vendors' attempts to present their services otherwise. It relies on an extensive technology stack crossing many domains that evolve independently and according to their own needs. Thus these vendors are consumers and users of a wide range of technology products used to deliver a service to *their* customers, who implicitly "buy in" to these decisions when they deploy a given service. Though there is nothing inherently wrong with this practice, it is heavily obfuscated in marketing and sales materials, which focus on per-device specification and leave the buyer to discern whether their deployment environment can acheive advertised performance. Given the cost and specificity of deploying a distributed data service within a medical simulation laboratory, consumers deserve a chance to review and question decisions ostensibly made on their behalf.

### User Experience (UX)
Humans have low tolerance for latency when interacting with a computer.[@Nielsen:2009:online] Engineering a consistent experience across a distributed, high-bandwidth service is extremely difficult. This is due to the increased complexity of distributed systems and their depedence on networks for data transmission: if the network is underperfomant, the system has limited ways to adjust, with each adjustment adding complexity and consuming system resources.

Near real-time is a typical use case for a medical simulation data system. Captured data are expected to be available immediately following the conclusion of a simulation exercise and delivered smoothly enough to not interrupt the educational process. Distributed systems also distribute their errors, so when a system underperforms--as it is occassionaly guaranteed to do--it can be difficult to discern the source *even for those with great familiarity*.[^chaos-engineering]

Vendors sell closed technology, and spend precious little time at client sites. They cannot be expected to have robust knowledge of a client's network characteristics, nor can they be expected to change their product if it is a bad fit; which will be discovered *after* the client has made a capital investment. This lack of transparency makes performance guarantees tenuous, gives vendors a side-out for issues (blame the network), and strongly limits the ability of a simulation laboratory to get the most out of their service. In general,

![lack-of-transparency]

While *vision* is certainly a complex distributed system prone to the same set of issues, it is **reviewable, modifiable, and provides information-rich logs** which empower simulation laboratories to adapt *vision* and/or their network to better meet the needs of their users.

### Limited Ecosystem of Essential Technologies
What a simulation data service can offer is limited by what its clients can consume. Codec support on end-user devices cannot be taken for granted, nor can it be assumed client devices are properly equipped to deliver a reasonable experience. Considering the essential "base" technologies, there are

- Two (2) widely-supported AV formats: H.26L and VP9.
- Four (4) common browsers: Chrome, Edge, Firefox, and Safari.[^vp9-support]
- Five (5) common operating systems: Andriod, iOS, Linux, MacOS, and Windows.
- One (1) appropriate streaming method with one (1) standard impelemtation: Adaptive Bitrate (ABR) Streaming via MPEG-DASH.[^abr-implementations]

That's 2\*4\*5\*1, or 40, possible combinations, and, looking from the client's side, we can safely exclude Linux and scale back to 2\*3\*4\*1, or 24, *likely* combinations. Vendors may also choose to develop a native client, sidestepping the browser and reducing the total number of combinations to 2\*4\*1 (8), but more likely to 2\*3\*1 (6) because tablets predominatly run Andriod or iOS, and occasionally Windows.

Considered from the service side, there are

- Two (2) likely operating system choices: Linux and Windows.
- One (1) standard utility for maniuplating AV data: FFmpeg.[^ffmpeg-dominance]

That's 2\*1 (2) combinations. The operating system does little more than host a simulation data service and its associated processes. This job is certainly important, but modern operating systems are reliable enough for engineers to put a majority of their focus elsewhere and assume the operating system is able to support their service.

Programming languages are discounted because even bad code runs fast on modern systems. Despite probable claims from vendors that their service is faster because it is written in a given language, an overwhelming majority of computationally-intensive tasks are handled by third-party services. Simulation data services are, a priori, distributed systems, so engineers are obligated to follow a single design pattern regardless of their choice of language. Architecture--which determines how a service distributes computational load--is a far better predictor of performance.

Thus simulation data services fail to meaningfully differentiate, contrary to vendor claims, and their closed-source nature makes it impossible for consumers to evaluate which implementation they desire. *vision* is robustly open-source, and based entirely on open-source technologies, allowing anyone to deeply review the service and its design.

### Security
Security is a primary and continuous concern for the transfer of digital information. Users want quick and easy access to their information, which vendors typically provide via web interfaces. The most commonly used protocols for web security, Transport Layer Security (TLS) and its predecessor Secure Socket Layer (SSL), have a well-established history of significant and pernicious security vulernabilities.[^ssl-insecurity] Given that these base technologies cannot be considered secure, any vendor credibly claiming to sell a secure system must demonstrate they

1. Implement end-to-end encryption for all data transmissions
2. Internally engineer, test, and maintain solutions which address vulnerabilities
3. Implement an agressive, time-sensitive pipeline to review vulnerabilities and implement fixes

Each of these options is expensive, time-consuming, and requires specialized knowledge and skill. A study on discovery of web sercurity vulnerabilities suggests that monetary incentive, the number of people working on a vulnerability, and the number of organizations working on a vulnerability correlate positively with discovery and addressal.[@Zhao:2015:inproceedings] These items are not compatible with a closed product, which cannot be reviewed or tested by a large community unless a vendor takes deliberate steps to do so. These limitations also apply to non-web vulernabilities in closed products, leaving end-users to take the word of a vendor that their data and service are "safe". The *vision* codebase is open, readily reviewable, and able to participate in the community efforts which have identified and patched numerous significant vulnerabilities.

### Globally Escalating Computational Overhead
Medical simulation technology is contained within an enormous, rapidly evolving, tens-of-billions of dollar technology ecosystem. Compared to this ecosystem, revenues for all medical simulation technology would fall well below the margin of calculation error for the same period. Simulation data vendors, and their users, are caught in this current, directed by billion-dollar budgets and broad-base consumer spending on gaming consoles, smartphones, and tablets.

The trend of escalating computational overhead means that end-user devices must be faster and more powerful to deliver experiences that are acceptable to users. This introduces difficulty for smaller vendors, whose users' expectations are set by high-end engineering teams and the products they create with large budgets. It also pushes an update cycle that may be infeasible for a majority of simulation laboratories, who cannot afford to regularly upgrade their cameras, networks, televisions, and servers. Combined, these issues are especially bad for vendors, whose competitiveness and sales can depend on offering "up-to-date" technologies, which are no guarantee of performance.

An example from an essential area of simulation data services, video quality, can help explain this. IBM introduced the VGA format in 1987. It offers a resoultion of 640x480 pixels, or 307200 pixels in total. In an RGB colorspace, which has 3 bytes per pixel, this is 307200 pixels \* 3 bytes/pixel = 921600 bytes, just under 1 megabyte (0.922) per frame. Using the common standard of 25 frames per second (fps), this is a data transfer rate of 23.04 megabytes/second.

Fast-forwarding to 2016 (~29 years), when the Video Electronics Standards Association (VESA) introduced DisplayPort 1.4 which supports 8K Ultra-High Definition (UHD) video. At a resolution of 7680x4320 pixels, this is total 33177600 pixels and 99532800 bytes (99.533 megabytes) per frame. Again using 25fps as a standard, 8K resolution requires approximately 2.49 *gigabytes*/second.

This is an average of 3.4 megabytes/second per year (~1133462.07 pixels) from 1987 to 2016, and over that period much of the processing has shifted to web browsers. The importance of this change in execution environment is that the typical web stack--CSS, HTML, and Javascript--is much more computationally expensive. It can be expected that more memory, disk space, and CPU power will be required each year, necessitatiing capital investment to provide an adquate user experience.

*vision*'s microservices are lightweight and indepedent. They target commodity hardware, allowing cheaper and fine-grained management of computational load across the data service. The separation of concerns between server and client microservices allows for the construction of non-web interfaces that can better exploit a target platform. While *vision* cannot stem the often silly escalation of computational demand, it provides medical simulation laboratories a far more robust toolchain with which to manage it.

## Barriers to Competition
The AV marketplace is largely composed of small, specialized companies investigating problems of well-defined scope. By-and-large, however, market activity is directed by the few large companies with deep interests in the delivery of data (e.g. advertisements) to potential customers. There is an important monetary difference between owning the *technology which delivers and processes signals* and owning the *content encoded in those signals*. Briefly, technology is used to sell content: the market for consumers of content is exponentially larger than the market for specialized hardware and software, thus the bulk of revenue is available to those who use data delivery systems as a way to facilitate access to the largest pool of potential customers.

### Minority Control of Market
Research and development of AV technology occurs in a niche market protective of Intellectual Property (IP). The market offers no clear incentive for collaboration and large companies, who own the platforms on which codecs execute, have considerable influence over standard adoption. Reporting in October 2017 for August 2016 data, smartphone market shares for Apple and Samsung were 35.0% and 35.2% respectively,[@KantarAppleMarketShare:2017:online] who collectively occupy 70.2% of the smartphone hardware market. Additionally, as of the third quarter of 2016 Google's Andriod operating system is estimated to occupy 88% of global smartphone shipments,[@Sui:2016:online] leaving 12% for the *remaining* group of smartphone operating systems. Such a market presence gives Apple and Google deep leverage over the technology used by consumers.

Standards create consistency, something that largely benefits the owners of content delivery networks who charge for the privilege of access to the users on their networks. From 2006 to 2016, internet advertising revenues in *the United States alone* grew approximately 429.0% from $16.9 billion to $72.5 billion,[@IABRevenueReport:2017:online, 5] with the "top ten" (10) companies commanding 69-75% of revenue over the same period.[@IABRevenueReport:2017:online, 9] In this case standardization is a revenue optimization strategy: the more devices end users own which support the standard, the larger the potential customer pool for advertisers.

Standards are also expensive and time-consuming to create. Many of the participants in standards-setting processes feel justified asking for compensation for their time and effort. Patent pools and strong notions of ownership have exploited this simple, and likely reasonable, request to create a market space advantageous to them.[@Balto:2013:online] This limits market growth and stifles innovation,[@Balto:2013:online] making vendors implicit consumers of a single, closed standard. These costs are ultimately borne by consumers, who pay higher prices due to license and royalty fees paid on their behalf.

*vision* uses the open and royalty-free format VP9 by default. It is the default encoding for YouTube, and well supported across the modern device ecosystem. Users may also implement other formats and encoding strategies, taking advantage of the open and free nature of *vision*.

### Patents and Ownership
H.26L formats are based heavily on patetented technology.[^mpeg-patents] And while a reasonable number of other formats are available, many require some type of licensing or implement part(s) of an H.26L format. A majority of these agreements separate encoding, streaming, and decoding; which allows the introduction of fees at each step in the delivery chain.

Numerous free and/or open source options have been introduced concurrent to the rise in popularity of the H.26L standards. Generally these can be divided into encoding **libraries**, such as *libx264*, *libx265*, and *libpvx*--for H.264, HEVC/H.265, and VP9 respectively--and **formats**, such as H.26L, Matroska, Ogg, WebM, and VP9--which define data structures and are used to interpret individual AV files. Here some interesting catch-22s arise

1. While the codecs *libx264* and *libx265* are free and open sourced, the H.26L family of formats is not. Anyone wishing to use them in production must negotiate a license agreement via
    - MPEG LA, LLC. Private, for-profit, licenses H.26L patent pools.[^mpeg-la]
    - HEVC Advance. Private, for-profit, licenses H.265/HEVC patent pools.[^hevc-advance]
    - Velos Media. Private, for-profit, licenses H.265/HEVC patent pools.[^velos-media]
    - Individual arrangements with associated patent holders.
2. H.26L *and* VP9 include patent-protected technology.
    - In certain cases, patent pools and individual holders allow royalty-free use of H.26L formats.[^h26-patent-license-terms]
    - Google, the owner and developer of VP9, grants an "in-kind" license that terminates on patent litigation.[@WebMLicense:misc]
3. H.264 is ubiquitous and there is already widespread support for HEVC/H.265 *and* VP9. Exposure to royalty fees depends on the engineering of a particular content service.[@Ozer:2017:online]

At least one significant patent holder, Technicolor, does not participate in any pool,[@IAMTechnicolor:2016:online] and inconsistent participation by patent holders has been identifed as a barrier to adoption of the HEVC standard.[@Vaughn:2016:online] Google offers VP9-related patents royalty-free, a trend the Alliance for Open Media will likely continue with the forthcoming AV1 format, which is as-of-yet untested and cannot be assumed market viable.

*vision*'s open and free codebase allows medical simulation laboratories to control how and where patent-protected technologies penetrate their ecosystem. As formats and technologies change, *vision* can be modified to accommodate, further enabling medical simulation laboratories to meet their needs.

## Addressing Challenges and Removing Barriers
*vision* increases the visibility of genuine engineering challenges and responds with a resillient, modern, reactive microservice-based architecture that is performant, stable, and scalable. It is a free and open codebase that utilizes free and open techonology by default, avoding vendor lock-in and insulating users from profit-motivated licensing schemes. *vision* is community-focused, developed specifically to meet the needs of medical simulation laboratories while ensuring their data remain their own. 

## References
[^chaos-engineering]: For Netflix, understanding the fail points of their system became so difficult they introduced a testing method called Chaos Engineering which involves delibeately crashing their production servers, sometimes under peak loads. See https://medium.com/netflix-techblog/tagged/chaos-engineering
[^ffmpeg-dominance]: Though other AV utilities are available FFmpeg is mature, performant, and free and open-source, making it a very popular choice. The author is not aware of any simulation data services that use an alternate AV utility.
[^h26-patent-license-terms]: See https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding#Patent_license_terms
[^hevc-advance]: https://www.hevcadvance.com/
[^high-fidelity-comment]: Consider that in 2003, access to a mannequin such as SimMan (now SimMan Classic) *was the definition of* a "high fidelity" simulation program. Ten years later, a properly equipped program owns *one or more* "high fidelity" mannequins--such as Laerdal's SimMan3G, CAE's iStan, or Guamard's HAL--several "mid"- and "low"- fidelity mannequins, dedicated simulation space, and an AV system able to capture at least one room.
[^megapixel-comment]: As an example, see advertisers' use of megapixel calcuations for advertising digital cameras.
[^mpeg-la]: http://www.mpegla.com/
[^mpeg-patents]: The patent list for the most common format as of this writing, AVC/H.264, is 112 pages.[@AVCPatents:2017:misc] The patent list for it's successor, HEVC/H.265, is 91 pages.[@HEVCPatents:2017:misc]
[^ssl-insecurity]: See https://www.gracefulsecurity.com/tls-ssl-vulnerabilities/ for a list
[^velos-media]: http://velosmedia.com/
[^vp9-support]: Safari does not support VP9.

[lack-of-transparency]: whitepaper/src/img/lack_of_transparency.png