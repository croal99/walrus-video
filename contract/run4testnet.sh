CLIENT_ADDRESS="0x167b61dcef37260fc8335e15a16cbad0a2f3ddc8a511169820f0c013396f205b"
#PACKAGE_ID="0x4e604631047cc74f4442d6a32817bf440ca5e498472210e36de77e736c843629"
PACKAGE_ID="0xaef6b6cc4545bb6bf2221d240d9ba5681e249d9d5ffb78f9e221bcecfff26f82"
PLAYER_ID="0x69962cdc73543852ade39b56f32ed3396817e830469f12d1020eb55d226994d4"
MANAGER_ID="0x83a466523c56300885b3fe5607c9c81771d96353a16e918a38499fd12ab5572a"
INFO_ID="0x969c32a4342c566123ae6d13e9c04c9e842d2194c85574d53f16870612d8c0a1"

#sui client switch --env testnet
#sui client envs
#
#sui client switch --address ${CLIENT_ADDRESS}
#sui client addresses

sui client call \
--package ${PACKAGE_ID} \
--module manage \
--function create_manager \
--args \
"良缘" \
"https://q4.itc.cn/images01/20241108/9094aae64b674655b64979bdee9a02cc.jpeg" \
"《良缘》| 横跨两个时代" \
"穿越" \
"许诗悦 李若天" \
"2025" \
"本剧横跨两个时代，小帅家族世代受诅咒，继承人通常活不过30岁，小美家族传承奇玉，辅以心头血可解除诅咒，两家族因此成为世仇，上上辈子的小帅为解除两家世仇，以命相抵。然后时间来到21世纪，这辈子的小帅因家族斗争，父母在年幼时即被害死，其叔父找了一个假的小帅试图侵占小帅继承权，长大后的小帅为了夺回继承权同时为了破除诅咒，设计与小美相遇。" \
20 \
3

#sui client call \
#--gas-budget 50000000 \
#--package ${PACKAGE_ID} \
#--module manage \
#--function update_blobs \
#--args ${INFO_ID} \
#["0VDZ4De_NHyxjNAJYIoz2h4HrCcGDwqFRAPJYb0e6NM",\
#"5xXM0wV5x_LKtAHHSYuIk4BrD9HSQCWxxN4cOQj-8pc",\
#"5xXM0wV5x_LKtAHHSYuIk4BrD9HSQCWxxN4cOQj-8pc",\
#"5xXM0wV5x_LKtAHHSYuIk4BrD9HSQCWxxN4cOQj-8pc",\
#"5xXM0wV5x_LKtAHHSYuIk4BrD9HSQCWxxN4cOQj-8pc"]

#sui client call \
#--package ${PACKAGE_ID} \
#--module manage \
#--function update_url \
#--args ${MANAGER_ID} \
#"https://q4.itc.cn/images01/20241108/9094aae64b674655b64979bdee9a02cc.jpeg"

#sui client call \
#--package ${PACKAGE_ID} \
#--module player \
#--function create_player