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
      **[[alloc] init] is a Bitcoin cryptography and protocol R&D company developing new metaprotocols for Bitcoin.**

      We use cryptography to expand what can be built on Bitcoin without changing Bitcoin itself. Bitcoin remains the publication, ordering, and settlement layer.

      - **No soft forks.**
      - **No trusted operators.**
      - **No separate consensus.**
    diagramSummary: >-
      PIPEs provide the cryptographic primitive. Vaults use it to control BTC on L1.
      Shielded Bitcoin combines private transfers with cryptographically controlled
      vaults and state derived from Bitcoin history.
    items:
      - title: Bitcoin PIPEs
        role: Cryptographic primitive
        summary: >-
          Witness encryption locks a Bitcoin signing key behind a computational
          condition. A valid witness reveals the key — enabling programmable
          vaults on Bitcoin L1.
        paperUrl: /uploads/pipesv2.pdf
        connection: Enable programmable vaults
        text: |
          **Bitcoin PIPEs is a cryptographic primitive using witness encryption that expands what Bitcoin can enforce without changing Bitcoin consensus.** PIPEs encrypt a Bitcoin signing key behind an arbitrary computational statement. Provide a valid witness — such as a zero-knowledge proof — and the key can be recovered to produce an ordinary Bitcoin signature. No valid witness means no signature, and therefore no spend.

          This makes capabilities such as **covenants, non-interactive ZK-proofs (NIZK), and programmable L1 vaults** possible without adding new Bitcoin opcodes.

          Bitcoin does not need to understand or execute the application logic. Cryptography enforces the condition; Bitcoin ultimately sees and verifies a standard transaction.

      - title: Programmable Vaults
        role: BTC on L1
        summary: >-
          Built with PIPEs, vaults release BTC when a valid proof satisfies their
          conditions. Those conditions can depend on shielded state reconstructed
          from Bitcoin history — connecting L1 BTC to the metaprotocol.
        connection: Connect L1 BTC to shielded state
        text: |
          **PIPEs enable programmable vaults on Bitcoin L1.**

          BTC can be locked behind arbitrary cryptographic conditions and released when a valid ZK-proof is provided. Unlike bridge architectures, this eliminates the need for operators to custody funds, advance withdrawals, or coordinate disputes.

          A valid proof allows the claimant to recover the vault key from the PIPE ciphertext and spend the BTC directly on Bitcoin L1. Because the unlocking condition can depend on metaprotocol state reconstructed from Bitcoin history, the vault acts as a cryptographic boundary between L1 BTC and Bitcoin metaprotocols.

          The result: Bitcoin controlled by cryptographic protocol rules, not operators.
      - title: Shielded Bitcoin
        role: Private transfers
        summary: >-
          Encrypted notes and zero-knowledge proofs enable private transfers;
          nullifiers prevent double-spends. Programmable vaults control the L1 BTC,
          while shielded state is reconstructed from data published to Bitcoin.
        text: |
          **Shielded Bitcoin is a non-custodial metaprotocol for private Bitcoin transfers.** Encrypted notes, public nullifiers, and zero-knowledge proofs preserve the privacy of participants, amounts, and transfer relationships while preventing double-spends.

          The design brings Zcash-style shielded architecture to Bitcoin, without introducing a separate blockchain or consensus. Protocol data is published to Bitcoin, making shielded state reconstructible from L1 history.

          Bitcoin gets privacy without compromising what makes it Bitcoin. Shielded pools for private transfers, cryptographically controlled L1 vaults for BTC, and shielded state derived from Bitcoin history. No bridges. No trusted operators. No separate consensus.

          Whitepaper — coming soon.
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
