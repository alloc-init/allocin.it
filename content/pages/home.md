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
  - introduction: |-
      **[[alloc] init] develops cryptographic protocols for Bitcoin.** Our primitives and metaprotocols expand what can be built on Bitcoin without changing consensus.

      We're currently building **Shielded Bitcoin**, a non-custodial metaprotocol for financial privacy on Bitcoin L1 — without relying on trusted operators, another chain, or separate consensus. 
    diagramSummary: |-
      PIPEs provide the cryptographic primitive for enforcing arbitrary conditions on Bitcoin without changing consensus. 

      L1 security vaults use PIPEs to control native BTC, encrypting the ability to spend behind cryptographic conditions that can be satisfied with a zero-knowledge proof. 

      Shielded Bitcoin builds on these vaults to enable private transfers, with protocol state derived directly from Bitcoin history.
    items:
      - title: Bitcoin PIPEs
        role: Cryptographic primitive
        summary: 'Bitcoin PIPEs use cryptography to enforce arbitrary conditions on Bitcoin without changing consensus — enabling covenants, zero-knowledge proofs, and L1 security vaults.'
        paperUrl: /uploads/pipesv2.pdf
        connection: Enable programmable vaults
        text: |
          Bitcoin PIPEs is a cryptographic primitive based on witness encryption that expands what Bitcoin can enforce without changing consensus. PIPEs encrypt a Bitcoin signing key behind an arbitrary computational condition. Satisfy the condition with a valid witness — such as a zero-knowledge proof — and the signing key can be recovered to authorize a standard Bitcoin transaction. Without a valid witness, there is no signature and no spend.

          This enables **covenants**, **non-interactive zero-knowledge proofs** **(NIZK), and programmable L1 security vaults** without adding new Bitcoin opcodes.

          **Bitcoin never needs to understand or execute the underlying logic.** Cryptography enforces the condition; Bitcoin verifies an ordinary signature and transaction.
      - title: Programmable Vaults
        role: Conditional spending
        summary: 'Built with PIPEs, vaults release Bitcoin when a valid proof satisfies their conditions. Those conditions can depend on shielded state reconstructed from Bitcoin history - connecting Bitcoin L1 to the metaprotocol.'
        connection: Connect Bitcoin L1 to shielded state
        text: |
          **PIPEs enable programmable vaults on Bitcoin L1.**

          Bitcoin can be locked behind arbitrary cryptographic conditions and released when a valid ZK-proof is provided. Unlike bridge architectures, this eliminates the need for operators to custody funds, advance withdrawals, or coordinate disputes.

          A valid proof allows the claimant to recover the vault key from the PIPE ciphertext and spend the Bitcoin directly on Bitcoin L1. Because the unlocking condition can depend on metaprotocol state reconstructed from Bitcoin history, the vault acts as a cryptographic boundary between Bitcoin L1 and Bitcoin metaprotocols.

          The result: Bitcoin controlled by cryptographic protocol rules, not operators.
      - title: Shielded Bitcoin
        role: Private transfers
        summary: 'Encrypted notes and zero-knowledge proofs enable private transfers; nullifiers prevent double-spends. Programmable vaults control the L1 BTC, while shielded state is reconstructed from data published to Bitcoin.'
        text: |
          **Shielded Bitcoin is a non-custodial metaprotocol for private Bitcoin transfers.** Encrypted notes, public nullifiers, and zero-knowledge proofs preserve the privacy of participants, amounts, and transfer relationships while preventing double-spends.

          The design brings Zcash-style shielded architecture to Bitcoin, without introducing a separate blockchain or consensus. Protocol data is published to Bitcoin, making shielded state reconstructible from L1 history.

          Bitcoin gets privacy without compromising what makes it Bitcoin. Shielded pools for private transfers, cryptographically controlled L1 vaults for BTC, and shielded state derived from Bitcoin history. No bridges. No trusted operators. No separate consensus.
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

