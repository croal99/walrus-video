/// Module: movie
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module movie::store {
    use sui::tx_context::sender;
    use movie::manage::{Self, Manage};

    // 影片库对象
    public struct ManageStore has key, store {
        id: UID,
        owner: address,                                 // owner
        managers: vector<address>                       // 仓库包含影片集合
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {
    }

    // ===== Public view functions =====

    // 更新节目
    public entry fun update_manage(
        store: &mut ManageStore,
        managers: vector<address>,
        _: &mut TxContext
    ) {
        store.managers = managers
    }

    public entry fun add_manage(
        store: &mut ManageStore,
        manager: &mut Manage,
        _: &mut TxContext
    ) {
        vector::push_back<address>(&mut store.managers, manager.id())
    }

    // 创建影片库对象
    public entry fun create_store(
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // create store
        let store = ManageStore {
            id: sui::object::new(ctx),
            owner: sender,
            managers: vector<address>[],
        };

        transfer::public_transfer(store, tx_context::sender(ctx));
    }

    // ===== Tests =====

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(ctx);
    }
}

