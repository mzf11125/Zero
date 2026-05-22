use borsh::BorshSerialize;
use sha2::{Digest, Sha256};

use solana_sdk::instruction::{AccountMeta, Instruction};
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::Keypair;
use solana_sdk::signer::Signer;
use solana_sdk::system_program;

const USDC_MINT: &str = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const AGENT_SEED: &[u8] = b"agent";
const AGENT_STATS_SEED: &[u8] = b"agent_stats";
const GLOBAL_REGISTRY_SEED: &[u8] = b"global_registry";

const AGENT_NAME: &str = "zero-agent";
const AGENT_DESCRIPTION: &str = "Zero hybrid autonomous agent (SAP + Ace x402)";
const AGENT_URI: &str = "https://github.com/NyokoKarmaNugroho/Zero";
const X402_ENDPOINT: &str = "https://api.acedata.cloud";

fn anchor_discriminator(name: &str) -> [u8; 8] {
    let mut hasher = Sha256::new();
    hasher.update(b"global:");
    hasher.update(name.as_bytes());
    let hash = hasher.finalize();
    let mut disc = [0u8; 8];
    disc.copy_from_slice(&hash[..8]);
    disc
}

pub fn find_agent_pda(owner: &Pubkey, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[AGENT_SEED, owner.as_ref()], program_id)
}

pub fn find_agent_stats_pda(owner: &Pubkey, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[AGENT_STATS_SEED, owner.as_ref()], program_id)
}

pub fn find_global_registry_pda(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[GLOBAL_REGISTRY_SEED], program_id)
}

#[derive(Debug)]
struct Capability {
    id: String,
    description: String,
    protocol_id: String,
    version: String,
}

impl BorshSerialize for Capability {
    fn serialize<W: borsh::io::Write>(&self, writer: &mut W) -> borsh::io::Result<()> {
        self.id.serialize(writer)?;
        self.description.serialize(writer)?;
        self.protocol_id.serialize(writer)?;
        self.version.serialize(writer)?;
        Ok(())
    }
}

#[derive(Debug)]
struct PricingTier {
    tier_id: String,
    price_per_call: u64,
    min_price_per_call: Option<u64>,
    max_price_per_call: Option<u64>,
    rate_limit: u32,
    max_calls_per_session: u32,
    burst_limit: u32,
    token_mint: [u8; 32],
    token_decimals: u32,
    min_escrow_deposit: u64,
    batch_interval_sec: Option<u32>,
}

impl BorshSerialize for PricingTier {
    fn serialize<W: borsh::io::Write>(&self, writer: &mut W) -> borsh::io::Result<()> {
        self.tier_id.serialize(writer)?;
        self.price_per_call.serialize(writer)?;
        self.min_price_per_call.serialize(writer)?;
        self.max_price_per_call.serialize(writer)?;
        self.rate_limit.serialize(writer)?;
        self.max_calls_per_session.serialize(writer)?;
        self.burst_limit.serialize(writer)?;
        writer.write_all(&[0u8])?; // token_type: USDC (variant 0)
        writer.write_all(&self.token_mint)?;
        self.token_decimals.serialize(writer)?;
        writer.write_all(&[0u8])?; // settlement_mode: X402 (variant 0)
        self.min_escrow_deposit.serialize(writer)?;
        self.batch_interval_sec.serialize(writer)?;
        writer.write_all(&[0u8])?; // volume_curve: None
        Ok(())
    }
}

#[derive(Debug)]
struct RegisterAgentArgs {
    name: String,
    description: String,
    capabilities: Vec<Capability>,
    pricing: Vec<PricingTier>,
    protocols: Vec<String>,
    agent_id: String,
    agent_uri: String,
    x402_endpoint: String,
}

impl BorshSerialize for RegisterAgentArgs {
    fn serialize<W: borsh::io::Write>(&self, writer: &mut W) -> borsh::io::Result<()> {
        self.name.serialize(writer)?;
        self.description.serialize(writer)?;
        self.capabilities.serialize(writer)?;
        self.pricing.serialize(writer)?;
        self.protocols.serialize(writer)?;
        self.agent_id.serialize(writer)?;
        self.agent_uri.serialize(writer)?;
        self.x402_endpoint.serialize(writer)?;
        Ok(())
    }
}

pub fn build_register_agent_instruction(
    agent: &Keypair,
    program_id: &Pubkey,
) -> Instruction {
    let owner = agent.pubkey();
    let (agent_pda, _) = find_agent_pda(&owner, program_id);
    let (agent_stats_pda, _) = find_agent_stats_pda(&owner, program_id);
    let (global_registry_pda, _) = find_global_registry_pda(program_id);

    let usdc_pubkey: Pubkey = USDC_MINT.parse().expect("valid USDC mint");
    let usdc_bytes: [u8; 32] = usdc_pubkey.to_bytes();

    let args = RegisterAgentArgs {
        name: AGENT_NAME.to_string(),
        description: AGENT_DESCRIPTION.to_string(),
        capabilities: vec![
            Capability {
                id: "acedata:chat".into(),
                description: "Ace Data Cloud chat completions".into(),
                protocol_id: "acedata".into(),
                version: "1".into(),
            },
            Capability {
                id: "acedata:image".into(),
                description: "Ace image generation".into(),
                protocol_id: "acedata".into(),
                version: "1".into(),
            },
            Capability {
                id: "acedata:video".into(),
                description: "Ace video generation".into(),
                protocol_id: "acedata".into(),
                version: "1".into(),
            },
        ],
        pricing: vec![PricingTier {
            tier_id: "default".into(),
            price_per_call: 10_000,
            min_price_per_call: None,
            max_price_per_call: None,
            rate_limit: 60,
            max_calls_per_session: 500,
            burst_limit: 10,
            token_mint: usdc_bytes,
            token_decimals: 6,
            min_escrow_deposit: 0,
            batch_interval_sec: None,
        }],
        protocols: vec!["sap".into(), "x402".into(), "acedata".into()],
        agent_id: owner.to_string(),
        agent_uri: AGENT_URI.to_string(),
        x402_endpoint: X402_ENDPOINT.to_string(),
    };

    let mut data = vec![];
    data.extend_from_slice(&anchor_discriminator("register_agent"));
    data.append(&mut borsh::to_vec(&args).expect("borsh serialize register_agent args"));

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(owner, true),
            AccountMeta::new_readonly(owner, false),
            AccountMeta::new(agent_pda, false),
            AccountMeta::new(agent_stats_pda, false),
            AccountMeta::new(global_registry_pda, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::pubkey::Pubkey;
    use solana_sdk::signature::Keypair;
    use solana_sdk::signer::Signer;
    use std::str::FromStr;

    #[test]
    fn test_discriminator_length() {
        let disc = anchor_discriminator("register_agent");
        assert_eq!(disc.len(), 8, "Anchor discriminator must be 8 bytes");
    }

    #[test]
    fn test_discriminator_deterministic() {
        let a = anchor_discriminator("register_agent");
        let b = anchor_discriminator("register_agent");
        assert_eq!(a, b, "discriminator must be deterministic");
    }

    #[test]
    fn test_discriminator_different_for_different_names() {
        let a = anchor_discriminator("register_agent");
        let b = anchor_discriminator("settle_escrow");
        assert_ne!(a, b, "different function names produce different discriminators");
    }

    #[test]
    fn test_pda_derivation_deterministic() {
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");
        let owner = Pubkey::from_str("11111111111111111111111111111111")
            .expect("valid pubkey");

        let (pda1, bump1) = find_agent_pda(&owner, &program_id);
        let (pda2, bump2) = find_agent_pda(&owner, &program_id);

        assert_eq!(pda1, pda2, "PDA must be deterministic");
        assert_eq!(bump1, bump2, "bump must be deterministic");
    }

    #[test]
    fn test_pda_not_owner_pubkey() {
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");
        let owner = Keypair::new();

        let (pda, _) = find_agent_pda(&owner.pubkey(), &program_id);
        assert_ne!(pda, owner.pubkey(), "PDA must not equal owner pubkey");
        assert!(
            !owner.pubkey().to_bytes().eq(&pda.to_bytes()),
            "PDA should be a derived address"
        );
    }

    #[test]
    fn test_global_registry_pda_deterministic() {
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let (pda1, _) = find_global_registry_pda(&program_id);
        let (pda2, _) = find_global_registry_pda(&program_id);

        assert_eq!(pda1, pda2, "global registry PDA must be deterministic");
    }

    #[test]
    fn test_instruction_has_correct_program_id() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);
        assert_eq!(ix.program_id, program_id);
    }

    #[test]
    fn test_instruction_data_starts_with_discriminator() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);
        let disc = anchor_discriminator("register_agent");

        assert!(
            ix.data.len() > 8,
            "instruction data must be longer than 8 bytes (discriminator + borsh args)"
        );
        assert_eq!(&ix.data[..8], &disc, "first 8 bytes must be the discriminator");
    }

    #[test]
    fn test_instruction_has_six_accounts() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);
        assert_eq!(
            ix.accounts.len(),
            6,
            "must have 6 accounts: signer, wallet, agent_pda, agent_stats_pda, global_registry_pda, system_program"
        );
    }

    #[test]
    fn test_signer_is_first_account_and_writable_and_signer() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);
        let signer = &ix.accounts[0];

        assert_eq!(signer.pubkey, agent.pubkey());
        assert!(signer.is_signer, "first account must be signer");
        assert!(signer.is_writable, "first account must be writable");
    }

    #[test]
    fn test_wallet_is_second_account_readonly() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);
        let wallet = &ix.accounts[1];

        assert_eq!(wallet.pubkey, agent.pubkey(), "wallet pubkey matches agent");
        assert!(!wallet.is_signer, "wallet must not be signer");
        assert!(!wallet.is_writable, "wallet must be read-only");
    }

    #[test]
    fn test_system_program_is_last_readonly() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);
        let sys_prog = &ix.accounts[5];

        assert_eq!(sys_prog.pubkey, solana_sdk::system_program::id());
        assert!(!sys_prog.is_signer, "system program must not be signer");
        assert!(!sys_prog.is_writable, "system program must be read-only");
    }

    #[test]
    fn test_pda_accounts_are_writable_not_signer() {
        let agent = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix = build_register_agent_instruction(&agent, &program_id);

        for i in 2..=4 {
            let pda = &ix.accounts[i];
            assert!(
                pda.is_writable,
                "PDA account {i} must be writable for initialization"
            );
            assert!(
                !pda.is_signer,
                "PDA account {i} must not be signer"
            );
        }
    }

    #[test]
    fn test_different_agents_produce_different_instructions() {
        let agent1 = Keypair::new();
        let agent2 = Keypair::new();
        let program_id = Pubkey::from_str("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ")
            .expect("valid SAP program id");

        let ix1 = build_register_agent_instruction(&agent1, &program_id);
        let ix2 = build_register_agent_instruction(&agent2, &program_id);

        assert_ne!(
            ix1.accounts[0].pubkey, ix2.accounts[0].pubkey,
            "different agents produce different signer pubkeys"
        );
    }

    #[test]
    fn test_borsh_roundtrip_capability() {
        let cap = Capability {
            id: "test:id".into(),
            description: "test desc".into(),
            protocol_id: "test_proto".into(),
            version: "1".into(),
        };
        let bytes = borsh::to_vec(&cap).expect("serialize");
        assert!(!bytes.is_empty(), "serialized capability must not be empty");
    }
}

