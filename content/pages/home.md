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
    diagramSummary: 'PIPEs provide the cryptographic primitive for enforcing arbitrary conditions on Bitcoin without changing consensus. Programmable security vaults on the L1 use PIPEs to control native BTC, encrypting the ability to spend behind cryptographic conditions that can be satisfied with a zero-knowledge proof. Shielded Bitcoin builds on these vaults to enable private transfers, with protocol state derived directly from Bitcoin history.'
    items:
      - title: Bitcoin PIPEs
        role: Cryptographic primitive
        summary: 'Bitcoin PIPEs use cryptography to enforce arbitrary conditions on Bitcoin without changing consensus — enabling covenants, zero-knowledge proofs, and L1 security vaults.'
        paperUrl: /uploads/pipesv2.pdf
        connection: Enable programmable vaults
        text: |
          Bitcoin PIPEs is a cryptographic primitive based on witness encryption that expands what Bitcoin can enforce without changing consensus. PIPEs encrypt a Bitcoin signing key behind an arbitrary computational condition. Satisfy the condition with a valid witness — such as a zero-knowledge proof — and the signing key can be recovered to authorize a standard Bitcoin transaction. Without a valid witness, there is no signature and no spend.

          This enables covenants, non-interactive zero-knowledge proofs (NIZK), and programmable L1 security vaults without adding new Bitcoin opcodes.

          **Bitcoin never needs to understand or execute the underlying logic.** Cryptography enforces the condition; Bitcoin verifies an ordinary signature and transaction.
      - title: Programmable Security Vaults
        role: Conditional spending of native BTC
        summary: 'Built with PIPEs, programmable vaults control native BTC using cryptographic conditions. Funds are released when those conditions are satisfied, including through proofs derived from shielded state reconstructed from Bitcoin history. '
        connection: Connect Bitcoin L1 to shielded state
        text: |
          PIPEs enable programmable security vaults for native BTC on L1.

          Bitcoin can be locked behind arbitrary cryptographic conditions and released when those conditions are satisfied — for example, by providing a valid zero-knowledge proof. Unlike bridge architectures, this removes the need for operators to custody funds, advance withdrawals, or coordinate disputes.

          A valid proof enables the user to recover the vault’s signing key from the PIPE ciphertext and spend the BTC directly on Bitcoin. The unlocking condition can depend on metaprotocol state reconstructed from Bitcoin history, allowing protocol state to cryptographically control when native BTC can be spent.

          **The result: native BTC controlled by cryptographic rules, not trusted operators.**
      - title: Shielded Bitcoin
        role: Non-custodial financial privacy on Bitcoin
        summary: 'Encrypted notes and zero-knowledge proofs enable private transfers; nullifiers prevent double-spends. Programmable vaults control the L1 BTC, while shielded state is reconstructed from data published to Bitcoin.'
        text: |
          Shielded Bitcoin is a non-custodial metaprotocol for financial privacy on Bitcoin L1. Encrypted notes, public nullifiers, and zero-knowledge proofs preserve the privacy of participants, amounts, and transfer relationships while preventing double-spends.

          The design brings Zcash-style shielded architecture to Bitcoin, without introducing a separate blockchain or consensus. Protocol data is published to Bitcoin, making shielded state reconstructible from L1 history.

          Bitcoin gets privacy without compromising what makes it Bitcoin. Shielded pools for private transfers, cryptographically controlled L1 vaults for BTC, and shielded state derived from Bitcoin history.

          **No bridges. No trusted operators. No separate consensus.**
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
      tag: TWITTER
      title: Follow us on Twitter
      subtitle: 'Research and updates from [[alloc] init].'
      linkUrl: 'https://twitter.com/allocinitxyz'
      backgroundImg: /uploads/logo-bg-primary.svg
    contactCta:
      tag: REACH OUT
      title: Get in touch
      subtitle: Learn about PIPEs or contribute to our research.
      email: hello@allocinit.xyz
      backgroundImg: /uploads/logo-bg-gray.svg
    _template: cta_section
---

