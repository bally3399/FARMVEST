module farmvest::farmvest{
    use std::string;

    const E_DUPLICATE_EMAIL: u64 = 5;
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_IDEA_NOT_FOUND: u64 = 2;
    const E_IDEA_NOT_OPEN: u64 = 3;
    const E_INVALID_FARMER: u64 = 6;
    const E_IDEA_HAS_FUNDING: u64 = 8;


    public struct Farmer has key, store {
        id: UID,
        name: string::String,
        password: string::String,
        email: string::String,
        role: Role
    }

    public struct FarmerTable has key, store {
        id: UID,
        farmers: vector<Farmer>
    }

    #[allow(unused_field)]
    public struct Investor has key, store {
        id: UID,
        name: string::String,
        password: string::String,
        email: string::String,
        address: address,
        investments: InvestmentTable,
        role: Role
    }

    public enum IdeaStatus has copy, drop, store {
            FUNDED, CLOSED, OPEN
    }

    public enum Role has copy, drop, store {
            FARMER, INVESTOR
    }

    public struct InvestorTable has key, store {
        id: UID,
        investors: vector<Investor>
    }

    public struct InvestmentTable has key, store {
        id: UID,
        investments: vector<Investment>
    }

    #[allow(unused_field)]
    public struct Investment has key, store {
        id: UID,
        idea_id: ID,
        investor_id: ID,
        ideas: IdeaTable,
        amount: vector<u64>
    }
    #[allow(unused_field)]
    public struct IdeaTable has key, store {
        id: UID,
        ideas: vector<Idea>
    }

    #[allow(unused_field)]
    public struct Idea has key, store {
        id: UID,
        picture_url: string::String,
        title: string::String,
        description: string::String,
        funding_goal: u64,
        current_funding: u64,
        status: IdeaStatus,
        total_invested: u64,
        farmer_email: string::String
    }

    fun init(ctx: &mut TxContext) {
        let farmers_table = FarmerTable {
            id: object::new(ctx),
            farmers: vector[]
        };

        let investors_table = InvestorTable {
            id: object::new(ctx),
            investors: vector[]
        };

        let ideas_table = IdeaTable {
            id: object::new(ctx),
            ideas: vector[]
        };

        let investments_table = InvestmentTable {
            id: object::new(ctx),
            investments: vector[]
        };

        transfer::share_object(farmers_table);
        transfer::share_object(investors_table);
        transfer::share_object(ideas_table);
        transfer::share_object(investments_table);
    }

    public fun register_farmer(
        list: &mut FarmerTable,
        name: string::String,
        password: string::String,
        email: string::String,
        ctx: &mut TxContext
    ) {
        let mut i = 0;
        while (i < vector::length(&list.farmers)) {
            let farmer = vector::borrow(&list.farmers, i);
            assert!(farmer.email != email, E_DUPLICATE_EMAIL);
            i = i + 1;
        };

        let farmer = Farmer {
            id: object::new(ctx),
            name,
            password,
            email,
            role: Role::FARMER
        };
        vector::push_back(&mut list.farmers, farmer);
    }




    public fun register_investor(list: &mut InvestorTable,
                                 name: string::String,
                                 password: string::String,
                                 address: address,
                                 email: string::String,
                                 ctx: &mut TxContext){

        let mut i = 0;
        while (i < vector::length(&list.investors)) {
            let farmer = vector::borrow(&list.investors, i);
            assert!(farmer.email != email, E_DUPLICATE_EMAIL);
            i = i + 1;
        };


        let investor = Investor{
            id: object::new(ctx),
            name,
            password,
            email,
            address,
            role: Role::INVESTOR,
            investments: InvestmentTable {
                id: object::new(ctx),
                investments: vector[]
            }
        };
        vector::push_back(&mut list.investors, investor)

    }

    public fun create_idea(
        list: &mut IdeaTable,
        farmer_table: &FarmerTable,
        picture_url: string::String,
        title: string::String,
        description: string::String,
        funding_goal: u64,
        farmer_email: string::String,
        ctx: &mut TxContext
    ) {

        //Iterates over the ideas vector in list (the IdeaTable) to ensure the new idea’s title is unique.
        let mut i = 0;
        while (i < vector::length(&list.ideas)) {
            let existing_idea = vector::borrow(&list.ideas, i);
            assert!(existing_idea.title != title, 2);
            i = i + 1;
        };

        //Checks if farmer_email corresponds to an existing farmer in farmer_table.
        let mut is_farmer = false;
        let mut j = 0;
        while (j < vector::length(&farmer_table.farmers)) {
            let farmer = vector::borrow(&farmer_table.farmers, j);
            if (farmer.email == farmer_email && farmer.role == Role::FARMER) {
                is_farmer = true;
                break
            };
            j = j + 1; //Increments j if no match is found.
        };
        assert!(is_farmer, 4);

        let idea = Idea {
            id: object::new(ctx),
            picture_url,
            title,
            description,
            funding_goal,
            total_invested: 0,
            status: IdeaStatus::OPEN,
            current_funding: 0,
            farmer_email
        };
        vector::push_back(&mut list.ideas, idea);

    }


    public fun invest(
        ideas_table: &mut IdeaTable,
        title: string::String,
        amount: u64,
        balance: u64,
        _ctx: &mut TxContext
    ) {
        assert!(balance >= amount, E_INSUFFICIENT_BALANCE);

        let mut index = 0;
        let mut found = false;

        while (index < vector::length(&ideas_table.ideas)) {
            let idea = vector::borrow_mut(&mut ideas_table.ideas, index);
            if (idea.title == title) {
                assert!(idea.status == IdeaStatus::OPEN, E_IDEA_NOT_OPEN);
                idea.total_invested = idea.total_invested + amount;
                idea.current_funding = idea.current_funding + amount;
                found = true;
                break
            };
            index = index + 1;
        };

        assert!(found, E_IDEA_NOT_FOUND);
    }


    public fun view_idea(
        ideas_table: &IdeaTable,
        title: string::String
    ): (string::String, string::String, string::String, u64, u64, u64, string::String, IdeaStatus) {
        let mut index = 0;
        let mut found = false;
        let mut picture_url = string::utf8(b"");
        let mut description = string::utf8(b"");
        let mut funding_goal = 0;
        let mut current_funding = 0;
        let mut status = IdeaStatus::OPEN;
        let mut total_invested = 0;
        let mut farmer_email = string::utf8(b"");

        while (index < vector::length(&ideas_table.ideas)) {
            let idea = vector::borrow(&ideas_table.ideas, index);
            if (idea.title == title) {
                picture_url = idea.picture_url;
                description = idea.description;
                funding_goal = idea.funding_goal;
                current_funding = idea.current_funding;
                status = idea.status;
                total_invested = idea.total_invested;
                farmer_email = idea.farmer_email;
                found = true;
                break
            };
            index = index + 1;
        };

        assert!(found, E_IDEA_NOT_FOUND);
        (picture_url, title, description, funding_goal, current_funding, total_invested, farmer_email, status)
    }


    public fun remove_idea(
        ideas_table: &mut IdeaTable,
        farmer_table: &FarmerTable,
        title: string::String,
    ) {
        let mut index = 0;
        let mut found = false;

        // Find and remove the idea
        while (index < vector::length(&ideas_table.ideas)) {
            let idea = vector::borrow(&ideas_table.ideas, index);
            if (idea.title == title) {
                assert!(idea.status == IdeaStatus::OPEN && idea.total_invested == 0, E_IDEA_HAS_FUNDING);
                // Verify the idea's farmer_email corresponds to a farmer
                let mut is_farmer = false;
                let mut j = 0;
                while (j < vector::length(&farmer_table.farmers)) {
                    let farmer = vector::borrow(&farmer_table.farmers, j);
                    if (farmer.email == idea.farmer_email && farmer.role == Role::FARMER) {
                        is_farmer = true;
                        break
                    };
                    j = j + 1;
                };
                assert!(is_farmer, E_INVALID_FARMER);
                let removed_idea = vector::remove(&mut ideas_table.ideas, index);
                let Idea { id, picture_url: _, title: _, description: _, funding_goal: _, current_funding: _, status: _, total_invested: _, farmer_email: _ } = removed_idea;
                object::delete(id);
                found = true;
                break
            };
            index = index + 1;
        };

        assert!(found, E_IDEA_NOT_FOUND);
    }

    public struct InvestmentData has copy, drop, store {
        idea_id: ID,
        idea_title: string::String,
        investor_id: ID,
        amount: u64
    }

    public fun get_all_investments(
        investment_table: &InvestmentTable,
        ideas_table: &IdeaTable
    ): vector<InvestmentData> {
        let mut investments = vector::empty<InvestmentData>();
        let mut index = 0;

        while (index < vector::length(&investment_table.investments)) {
            let investment = vector::borrow(&investment_table.investments, index);
            let mut amount_index = 0;
            while (amount_index < vector::length(&investment.amount)) {
                let mut idea_title = string::utf8(b"Unknown");
                let mut idea_index = 0;
                while (idea_index < vector::length(&ideas_table.ideas)) {
                    let idea = vector::borrow(&ideas_table.ideas, idea_index);
                    if (object::uid_to_inner(&idea.id) == investment.idea_id) {
                        idea_title = idea.title;
                        break
                    };
                    idea_index = idea_index + 1;
                };
                let investment_data = InvestmentData {
                    idea_id: investment.idea_id,
                    idea_title,
                    investor_id: investment.investor_id,
                    amount: 1000
                };
                vector::push_back(&mut investments, investment_data);
                amount_index = amount_index + 1;
            };
            index = index + 1;
        };

        investments
    }


    #[test]
    fun test_successful_registration() {
        let mut ctx = tx_context::dummy();
        let mut table = FarmerTable {
            id: object::new(&mut ctx),
            farmers: vector[]
        };
        assert!(vector::length(&table.farmers) == 0, 0);

        register_farmer(
            &mut table,
            string::utf8(b"Alice"),
            string::utf8(b"password123"),
            string::utf8(b"alice@example.com"),
            &mut ctx
        );

        assert!(vector::length(&table.farmers) == 1, 1);
        let farmer = vector::borrow(&table.farmers, 0);
        assert!(farmer.name == string::utf8(b"Alice"), 2);
        assert!(farmer.email == string::utf8(b"alice@example.com"), 3);
        assert!(farmer.role == Role::FARMER, 4);

        let FarmerTable { id, mut farmers } = table;
        let Farmer { id: farmer_id, name: _, password: _, email: _, role: _ } = vector::pop_back(&mut farmers);
        object::delete(farmer_id);
        vector::destroy_empty(farmers);
        object::delete(id);
    }

    #[test]
    fun test_successful_investor_registration() {
        let mut ctx = tx_context::dummy();
        let mut table = InvestorTable {
            id: object::new(&mut ctx),
            investors: vector[]
        };
        assert!(vector::length(&table.investors) == 0, 0);

        register_investor(
            &mut table,
            string::utf8(b"Alice"),
            string::utf8(b"password123"),
            @0x0,
            string::utf8(b"investor@gmail.com"),
            &mut ctx
        );

        assert!(vector::length(&table.investors) == 1, 1);
        let investor = vector::borrow(&table.investors, 0);
        assert!(investor.name == string::utf8(b"Alice"), 2);
        assert!(investor.email == string::utf8(b"investor@gmail.com"), 3);
        assert!(investor.role == Role::INVESTOR, 4);

        let InvestorTable { id, mut investors } = table;
        let Investor { id: investor_id, name: _, password: _, address: _, email: _, role: _, investments } = vector::pop_back(&mut investors);
        let InvestmentTable { id: investment_id, investments: investment_vec } = investments;
        vector::destroy_empty(investment_vec);
        object::delete(investment_id);
        object::delete(investor_id);
        vector::destroy_empty(investors);
        object::delete(id);
    }

    #[test]
    fun test_create_idea() {
        let mut ctx = tx_context::dummy();
        let mut farmer_table = FarmerTable {
            id: object::new(&mut ctx),
            farmers: vector[]
        };
        register_farmer(
            &mut farmer_table,
            string::utf8(b"Bob"),
            string::utf8(b"password456"),
            string::utf8(b"bob@example.com"),
            &mut ctx
        );

        let mut idea_table = IdeaTable {
            id: object::new(&mut ctx),
            ideas: vector[]
        };
        create_idea(
            &mut idea_table,
            &farmer_table,
            string::utf8(b"http://example.com/pic.jpg"),
            string::utf8(b"New Project"),
            string::utf8(b"A great idea"),
            1000,
            string::utf8(b"bob@example.com"),
            &mut ctx
        );

        assert!(vector::length(&idea_table.ideas) == 1, 1);
        let idea = vector::borrow(&idea_table.ideas, 0);
        assert!(idea.title == string::utf8(b"New Project"), 2);
        assert!(idea.farmer_email == string::utf8(b"bob@example.com"), 3);
        assert!(idea.status == IdeaStatus::OPEN, 4);

        let FarmerTable { id: farmer_id, mut farmers } = farmer_table;
        let Farmer { id: f_id, name: _, password: _, email: _, role: _ } = vector::pop_back(&mut farmers);
        object::delete(f_id);
        vector::destroy_empty(farmers);
        object::delete(farmer_id);

        let IdeaTable { id, mut ideas } = idea_table;
        let Idea { id: idea_id, picture_url: _, title: _, description: _, funding_goal: _, current_funding: _, status: _, total_invested: _, farmer_email: _ } = vector::pop_back(&mut ideas);
        object::delete(idea_id);
        vector::destroy_empty(ideas);
        object::delete(id);
    }

    #[test]
    fun test_remove_idea() {
        let mut ctx = tx_context::dummy();
        let mut farmer_table = FarmerTable { id: object::new(&mut ctx), farmers: vector[] };
        register_farmer(
            &mut farmer_table,
            string::utf8(b"Bob"),
            string::utf8(b"password456"),
            string::utf8(b"bob@example.com"),
            &mut ctx
        );
        let mut idea_table = IdeaTable { id: object::new(&mut ctx), ideas: vector[] };
        create_idea(
            &mut idea_table,
            &farmer_table,
            string::utf8(b"http://example.com/pic.jpg"),
            string::utf8(b"New Project"),
            string::utf8(b"A great idea"),
            1000,
            string::utf8(b"bob@example.com"),
            &mut ctx
        );
        remove_idea(
            &mut idea_table,
            &farmer_table,
            string::utf8(b"New Project"),
        );
        assert!(vector::length(&idea_table.ideas) == 0, 1);

        let FarmerTable { id: farmer_id, mut farmers } = farmer_table;
        let Farmer { id: f_id, name: _, password: _, email: _, role: _ } = vector::pop_back(&mut farmers);
        object::delete(f_id);
        vector::destroy_empty(farmers);
        object::delete(farmer_id);

        let IdeaTable { id, ideas } = idea_table;
        vector::destroy_empty(ideas);
        object::delete(id);
    }

}

