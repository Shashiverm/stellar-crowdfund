#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub title: String,
    pub goal: i128,
    pub raised: i128,
    pub owner: Address,
    pub donor_count: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Donation {
    pub donor: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
enum DataKey {
    Campaign,
    Donations,
}

#[contract]
pub struct StellarFundContract;

#[contractimpl]
impl StellarFundContract {
    pub fn init(env: Env, owner: Address, title: String, goal: i128) {
        owner.require_auth();
        if goal <= 0 {
            panic!("Goal must be positive");
        }
        if env.storage().instance().has(&DataKey::Campaign) {
            panic!("Already initialized");
        }

        let campaign = Campaign { title, goal, raised: 0, owner, donor_count: 0 };
        env.storage().instance().set(&DataKey::Campaign, &campaign);
        let donations: Vec<Donation> = Vec::new(&env);
        env.storage().instance().set(&DataKey::Donations, &donations);
    }

    pub fn donate(env: Env, donor: Address, amount: i128) {
        donor.require_auth();
        if amount <= 0 {
            panic!("Donation amount must be positive");
        }

        let mut campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).expect("campaign not initialized");
        let mut donations: Vec<Donation> = env.storage().instance().get(&DataKey::Donations).unwrap_or(Vec::new(&env));
        
        let timestamp = env.ledger().timestamp();
        let donation = Donation { donor: donor.clone(), amount, timestamp };
        
        campaign.raised = campaign.raised.checked_add(amount).expect("overflow");
        campaign.donor_count += 1;
        donations.push_back(donation);
        
        env.storage().instance().set(&DataKey::Campaign, &campaign);
        env.storage().instance().set(&DataKey::Donations, &donations);
        
        env.events().publish((symbol_short!("donated"), donor), amount);
    }

    pub fn is_initialized(env: Env) -> bool {
        env.storage().instance().has(&DataKey::Campaign)
    }

    pub fn get_campaign(env: Env) -> Campaign {
        env.storage().instance().get(&DataKey::Campaign).expect("campaign not initialized")
    }

    pub fn get_donations(env: Env) -> Vec<Donation> {
        env.storage().instance().get(&DataKey::Donations).unwrap_or(Vec::new(&env))
    }

    pub fn get_donor_count(env: Env) -> u32 {
        let campaign: Campaign = env.storage().instance().get(&DataKey::Campaign).expect("campaign not initialized");
        campaign.donor_count
    }
}