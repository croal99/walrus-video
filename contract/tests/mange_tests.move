#[test_only]
#[allow(unused_use, unused_variable)]
module movie::manage_tests {
    // uncomment this line to import the module
    use std::debug;
    use std::ascii::string;
    use std::string::{Self, String};
    use sui::test_scenario as ts;
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::sui::SUI;
    use movie::store::{Self, ManageStore};
    use movie::manage::{Self, Manage, Info};
    use movie::player::{Self, Player};

    #[test]
    fun test_manage() {
        let admin = @0xA;
        let user = @0xB;
        let tom = @0xC;
        let mut scenario = ts::begin(admin);
        let mut player: Player;
        let mut manager: Manage;
        let mut info: Info;

        // init
        ts::next_tx(&mut scenario, admin);
        {
            manage::test_for_init(scenario.ctx());
        };

        // create manager
        debug::print(&string::utf8(b"create manager"));
        ts::next_tx(&mut scenario, admin);
        {
            manage::create_manager(
                b"Movie",
                b"https://",
                b"movie title",
                b"movie tag",
                b"actors",
                b"year",
                b"movie description",
                20,
                3,
                scenario.ctx()
            );
        };
        ts::next_tx(&mut scenario, admin);
        {
            manager = ts::take_shared<Manage>(&scenario);
            info = ts::take_from_sender<Info>(&scenario);
        };

        // 添加节目
        ts::next_tx(&mut scenario, admin);
        {
            let blob_ids = vector[
                string::utf8(b"movie 001"),
                string::utf8(b"movie 002"),
                string::utf8(b"movie 003"),
            ];

            manage::update_blobs(&mut info, blob_ids, scenario.ctx());
        };

        // 更新费率（由于所有权变更，这里应该错误，但是测试系统无法识别该错误）
        ts::next_tx(&mut scenario, tom);
        {
            manage::update_fee(&mut info, &mut manager, 100_000_000, scenario.ctx());
        };

        // 创建player
        debug::print(&string::utf8(b"create player"));
        ts::next_tx(&mut scenario, user);
        {
            player::create_player(scenario.ctx());
        };
        ts::next_tx(&mut scenario, user);
        {
            player = ts::take_from_sender<Player>(&scenario);
        };

        // 付费订阅
        debug::print(&string::utf8(b"pay and subscribe"));
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(100_000_000, scenario.ctx());
            // manage::subscribe(&mut manager, pay,scenario.ctx());
            player::subscribe(&mut player, &mut manager, pay,scenario.ctx());
        };

        // 重复订阅
        debug::print(&string::utf8(b"repay"));
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(10_000_000, scenario.ctx());
            player::subscribe(&mut player, &mut manager, pay,scenario.ctx());
        };

        ts::next_tx(&mut scenario, user);
        {
            debug::print(&player);
            debug::print(&manager);
            debug::print(&info);
        };

        ts::next_tx(&mut scenario, admin);
        {
            ts::return_shared<Manage>(manager);
            ts::return_to_sender<Info>(&scenario, info);
        };

        ts::next_tx(&mut scenario, user);
        {
            ts::return_to_sender<Player>(&scenario, player);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_manage_create() {
        let admin = @0xA;
        let user = @0xB;
        let mut scenario = ts::begin(admin);
        let mut player: Player;
        let mut manager: Manage;
        let mut info: Info;

        // init
        ts::next_tx(&mut scenario, admin);
        {
            manage::test_for_init(scenario.ctx());
        };

        // create manager
        debug::print(&string::utf8(b"create manager"));
        ts::next_tx(&mut scenario, admin);
        {
            manage::create_manager(
                b"Movie",
                b"https://",
                b"movie title",
                b"movie tag",
                b"actors",
                b"year",
                b"movie description",
                20,
                3,
                scenario.ctx()
            );
        };
        ts::next_tx(&mut scenario, admin);
        {
            manager = ts::take_shared<Manage>(&scenario);
            info = ts::take_from_sender<Info>(&scenario);
        };

        // 添加节目
        ts::next_tx(&mut scenario, user);
        {
            let blob_ids = vector[
                string::utf8(b"movie 001"),
                string::utf8(b"movie 002"),
                string::utf8(b"movie 003"),
            ];

            manage::update_blobs(&mut info, blob_ids, scenario.ctx());
        };

        // 直接付费订阅
        debug::print(&string::utf8(b"pay and subscribe"));
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(10_000_000, scenario.ctx());
            // manage::subscribe(&mut manager, pay,scenario.ctx());
            player::create_subscribe(&mut manager, pay,scenario.ctx());
        };
        ts::next_tx(&mut scenario, user);
        {
            player = ts::take_from_sender<Player>(&scenario);
            // debug::print(&player);
        };

        // 重复订阅
        debug::print(&string::utf8(b"repay"));
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(10_000_000, scenario.ctx());
            player::subscribe(&mut player, &mut manager, pay,scenario.ctx());
        };

        ts::next_tx(&mut scenario, user);
        {
            debug::print(&player);
            debug::print(&manager);
        };

        ts::next_tx(&mut scenario, admin);
        {
            ts::return_shared<Manage>(manager);
            ts::return_to_sender<Info>(&scenario, info);
        };

        ts::next_tx(&mut scenario, user);
        {
            ts::return_to_sender<Player>(&scenario, player);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_manage_store() {
        let admin = @0xA;
        let user = @0xB;
        let mut scenario = ts::begin(admin);
        let mut store: ManageStore;
        let mut manager: Manage;

        // init
        ts::next_tx(&mut scenario, admin);
        {
            manage::test_for_init(scenario.ctx());
        };

        // create manager
        debug::print(&string::utf8(b"create manager"));
        ts::next_tx(&mut scenario, user);
        {
            manage::create_manager(
                b"Movie",
                b"https://",
                b"movie title",
                b"movie tag",
                b"actors",
                b"year",
                b"movie description",
                20,
                3,
                scenario.ctx()
            );
        };
        ts::next_tx(&mut scenario, user);
        {
            manager = ts::take_shared<Manage>(&scenario);
        };

        // create store
        ts::next_tx(&mut scenario, admin);
        {
            store::create_store(
                scenario.ctx()
            );
        };
        ts::next_tx(&mut scenario, admin);
        {
            store = ts::take_from_sender<ManageStore>(&scenario);
        };

        // add into store
        ts::next_tx(&mut scenario, admin);
        {
            store::add_manage(&mut store, &mut manager, scenario.ctx());
        };
        debug::print(&store);

        // add into store
        ts::next_tx(&mut scenario, admin);
        {
            let manages = vector[
                @0x001,
                @0x002,
                @0x003,
            ];

            store::update_manage(&mut store, manages, scenario.ctx());
        };

        debug::print(&store);
        debug::print(&manager);

        ts::next_tx(&mut scenario, admin);
        {
            ts::return_shared<Manage>(manager);
            ts::return_to_sender<ManageStore>(&scenario, store);
        };

        ts::end(scenario);
    }

}
