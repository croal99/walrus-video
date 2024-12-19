/// Module: movie
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module movie::player {
    use std::debug;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string::{Self, String};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::object_table::{Self, ObjectTable};
    use movie::manage::{Self, Manage};

    const EMapData: u64 = 0;

    public struct Player has key, store {
        id: UID,
        owner: address, // 地址
        subscribe_table: Table<address, String>, // 订阅列表（用于记录用户订阅的影片）
    }

    // ===== Events =====
    public struct PlayerMinted has copy, drop {
        creator: address,
        name: string::String,
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {}

    // ===== Public view functions =====
    // public fun is_pay(
    //     player: &Player,
    //     manager: &Manage,
    // ): bool {
    //     player.subscribe_table.contains(manager.owner())
    // }

    public entry fun create_player(
        ctx: &mut TxContext
    ) {
        let player = Player {
            id: sui::object::new(ctx),
            owner: tx_context::sender(ctx),
            subscribe_table: table::new<address, String>(ctx),
        };

        transfer::public_transfer(player, tx_context::sender(ctx));
    }

    // 支付费用订阅视频集
    public entry fun subscribe(
        player: &mut Player,
        manager: &mut Manage,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // 查询是否存在订阅
        if (player.subscribe_table.contains(manager.id())) {
            debug::print(&string::utf8(b"movie is subscribed"));

            // 退回Coin
            transfer::public_transfer(payment, tx_context::sender(ctx));

            return
        };

        // 支付订阅费
        manage::subscribe(manager, payment, ctx);
        debug::print(&string::utf8(b"pay ok"));

        // 记录已经订阅的影片
        player.subscribe_table.add(manager.id(), *manage::name(manager));
    }

    // 支付费用订阅视频集（创建player对象）
    public entry fun create_subscribe(
        manager: &mut Manage,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let mut player = Player {
            id: sui::object::new(ctx),
            owner: tx_context::sender(ctx),
            subscribe_table: table::new<address, String>(ctx),
        };

        // 支付费用订阅
        subscribe(&mut player, manager, payment, ctx);

        transfer::public_transfer(player, tx_context::sender(ctx));
    }


    // ===== Tests =====

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(ctx);
    }
}

