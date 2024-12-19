/// Module: movie
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module movie::manage {
    use std::ascii::string;
    use std::debug;
    use std::string::{Self, String};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::coin::{Self, TreasuryCap, Coin};
    use sui::object_table::{Self, ObjectTable};
    use sui::balance::{Self, Balance};
    use sui::token::{Self, Token};
    use sui::sui::SUI;
    use sui::transfer::transfer;
    use sui::tx_context::sender;

    /// Error code for incorrect amount.
    const EIncorrectAmount: u64 = 0;
    const EIncorrectOwner: u64 = 1;

    /// Play fee (0.01 Sui)
    const PLAY_PRICE: u64 = 10_000_000;

    // 影片管理对象
    public struct Manage has key, store {
        id: UID,
        owner: address,                                 // owner
        subscribe_total: u64,                           // 订阅总人数
        info: address,                                  // info object address
        fee: u64,                                       // 费用
        name: String,                                   // 电影名
    }

    // 影片信息
    public struct Info has key, store {
        id: UID,
        owner: address,                                 // owner
        url: Url,                                       // 海报
        name: String,                                   // 电影名
        title: String,                                  // 标题
        tag: String,                                    // 标签
        actors: String,                                 // 演员
        year: String,                                   // 年代
        description: String,                            // 描述
        total_count: u64,                               // 分集数量
        free_count: u64,                                // 免费分集数量
        fee: u64,                                       // 费用
        balance: Balance<SUI>,                          // 收入
        blob_ids: vector<String>,                       // 分集数据
        salt: String,                                   // 盐
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {
    }

    // ===== Public view functions =====

    public fun name(manager: &Manage): &string::String {
        &manager.name
    }

    public fun id(manager: &Manage): address {
        object::id_to_address(object::uid_as_inner(&manager.id))
    }

    // ===== Public update functions =====
    // 更新名称（同步更新manager）
    public entry fun update_name(
        info: &mut Info,
        manager: &mut Manage,
        name: vector<u8>,
        _: &mut TxContext
    ) {
        info.name = string::utf8(name);
        manager.name = info.name;
    }

    // 更新费率（同步更新manager）
    public entry fun update_fee(
        info: &mut Info,
        manager: &mut Manage,
        fee: u64,
        _: &mut TxContext
    ) {
        info.fee = fee;
        manager.fee = info.fee;
    }

    // ===== Only owner update functions =====
    public entry fun update_url(
        info: &mut Info,
        url: vector<u8>,
        _: &mut TxContext
    ) {
        info.url = url::new_unsafe_from_bytes(url)
    }

    public entry fun update_title(
        info: &mut Info,
        title: vector<u8>,
        _: &mut TxContext
    ) {
        info.title = string::utf8(title)
    }

    public entry fun update_tag(
        info: &mut Info,
        tag: vector<u8>,
        _: &mut TxContext
    ) {
        info.tag = string::utf8(tag)
    }

    public entry fun update_actors(
        info: &mut Info,
        actors: vector<u8>,
        _: &mut TxContext
    ) {
        info.actors = string::utf8(actors)
    }

    public entry fun update_year(
        info: &mut Info,
        year: vector<u8>,
        _: &mut TxContext
    ) {
        info.year = string::utf8(year)
    }

    // 更新描述
    public entry fun update_description(
        info: &mut Info,
        description: vector<u8>,
        _: &mut TxContext
    ) {
        info.description = string::utf8(description)
    }

    // 更新节目
    public entry fun update_blobs(
        info: &mut Info,
        blob_ids: vector<String>,
        salt: vector<u8>,
        _: &mut TxContext
    ) {
        info.salt = string::utf8(salt);
        info.blob_ids = blob_ids
    }

    // 创建节目清单管理（可以用范型来实现更多管理）
    public entry fun create_manager(
        name: vector<u8>,
        url: vector<u8>,
        title: vector<u8>,
        tag: vector<u8>,
        actors: vector<u8>,
        year: vector<u8>,
        description: vector<u8>,
        total_count: u64,
        free_count: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // create info
        let info = Info {
            id: sui::object::new(ctx),
            owner: sender,
            url: url::new_unsafe_from_bytes(url),
            name: string::utf8(name),
            title: string::utf8(title),
            tag: string::utf8(tag),
            actors: string::utf8(actors),
            year: string::utf8(year),
            description: string::utf8(description),
            total_count,
            free_count,
            blob_ids: vector<String>[],
            balance: balance::zero(),
            fee: PLAY_PRICE,
            salt: string::utf8(b""),
        };

        // create manager
        let manager = Manage {
            id: sui::object::new(ctx),
            owner: sender,
            subscribe_total: 0,
            info: object::id_to_address(object::uid_as_inner(&info.id)),
            fee: info.fee,                  // 同步费率
            name: string::utf8(name),       // 同步名称
        };

        // info对象只能分配给创建者
        transfer::public_transfer(info, tx_context::sender(ctx));

        // manager对象需要share
        transfer::public_share_object(manager);
    }

    // 支付费用订阅视频集
    public fun subscribe(
        manager: &mut Manage,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(payment.value() == manager.fee, EIncorrectAmount);
        // debug::print(manager);

        // 增加订阅数量
        manager.subscribe_total = manager.subscribe_total + 1;

        // 支付给影片创建者
        transfer::public_transfer(payment, manager.owner);
    }


    // ===== Tests =====

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(ctx);
    }
}

