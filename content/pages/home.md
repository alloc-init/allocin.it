---
title: '[[alloc] init]'
blocks:
  - color: default
    columns:
      - title: ''
        items: []
      - title: ''
        items: []
    _template: content
  - introduction: |
      [[alloc] init] is a Bitcoin cryptography and protocol R&D company developing new metaprotocols for Bitcoin.

      No soft forks. No trusted operators. No separate consensus.

      Rather than adding opcodes or moving applications to another chain, we use cryptography to enforce richer protocol rules while Bitcoin remains the underlying publication, ordering, and settlement layer.
    items:
      - title: Bitcoin PIPEs
        text: |
          **Enforce arbitrary conditions on Bitcoin through cryptography.**

          **Bitcoin PIPEs is a cryptographic primitive that expands what Bitcoin can enforce without changing Bitcoin consensus.** Based on witness encryption, PIPEs encrypt a Bitcoin signing key behind an arbitrary computational statement. Provide a valid witness — such as a zero-knowledge proof — and the key can be recovered to produce an ordinary Bitcoin signature. No valid witness means no signature, and therefore no spend.

          This makes capabilities such as **covenants, non-interactive ZK-proof verification, and programmable L1 vaults** possible without adding new Bitcoin opcodes.

          The key distinction is architectural: **Bitcoin does not need to understand or execute the application logic.** Cryptography enforces the condition; Bitcoin ultimately sees and verifies a standard transaction.

          **Bitcoin remains Bitcoin. PIPEs expand what it can enforce.**
      - title: Programmable Vaults
        text: |
          **Bitcoin that unlocks when a cryptographic condition is satisfied.**

          **PIPEs enable programmable vaults on Bitcoin L1.** BTC can be locked until a specified cryptographic condition is satisfied using a zero-knowledge proof.

          Unlike bridge architectures, this eliminates the need for operators to custody funds, advance withdrawals, or coordinate disputes. Once the condition is met, the claimant can recover the vault key from the PIPE ciphertext and spend the BTC directly.

          The unlocking condition can depend on **metaprotocol state reconstructed from Bitcoin history**, making the vault a cryptographic boundary between BTC on L1 and protocols operating above it.

          **The result: Bitcoin controlled by cryptographic protocol rules, not operators.**
      - title: Shielded Bitcoin Metaprotocol
        text: |
          **Private transfers anchored to Bitcoin L1.**

          **Shielded Bitcoin is a non-custodial metaprotocol for private Bitcoin transfers.** It uses encrypted notes, public nullifiers, and zero-knowledge proofs to preserve the privacy of participants, amounts, and transfer relationships while cryptographically proving transaction validity and no double spending.

          The design brings **Zcash-style shielded architecture to Bitcoin**, without introducing a separate blockchain or consensus network. Protocol data is published to Bitcoin, allowing shielded state to be reconstructed from Bitcoin L1 history.

          **PIPE-controlled L1 vaults provide the boundary** between BTC and the shielded system.

          **Private transfers on Bitcoin. L1 publication, ordering, and settlement.**
    color: default
    _template: features
  - title: FEATURED
    researchItems:
      - research: content/research/Bitcoin-PIPEs-v2.mdx
      - research: content/research/AADP-WE.mdx
      - research: content/research/Bitcoin-PIPEs.mdx
    viewAllLink: /research
    color: default
    _template: featured_research
  - careerCta:
      tag: CAREERS
      title: Join our team
      subtitle: We are hiring across several technical roles
      linkUrl: 'https://allocinit.notion.site/Careers-19136974087f802392fbedbfd1ebca2b?pvs=4'
      backgroundImg: /uploads/logo-bg-primary.svg
    contactCta:
      tag: REACH OUT
      title: Get in touch
      subtitle: Learn about PIPEs or contribute to our research.
      email: hello@allocinit.xyz
      backgroundImg: /uploads/logo-bg-gray.svg
    _template: cta_section
---
