//初始化主办方监听事件
function initSponsorEvent() {
    console.log("注册主办方事件监听");
    // OneLive合约地址设置成功通知
    onelivecoin.InitOneLive().watch(function(error, result){
        if (!error) {
            console.log("初始化合约地址成功");
            prompt("OneLive地址设置成功");
            $('.OneLiveCoinOneLiveAddr').text(onelivecoin.oneLive.call());
        }
    });
    // 发行代币成功通知
    onelivecoin.Mint().watch(function(error, result){
        if (!error) {
            console.log("Mint Ok");
            prompt("发行代币成功， " + result.args.receiver + " 收到LiveCoin " + result.args.value + "C");
            showAccount();
        }
    });
    // 发布奖品成功通知
    onelive.PostGoods().watch(function(error, result){
        if (!error) {
            console.log("PostGoods Ok");
            prompt("发布奖品成功，奖品编号 " + result.args.goodsId);
            showTopGoodsId();
        }
    });
}

//显示最新奖品编号
function showTopGoodsId() {
    $('.topGoodsId').text(onelive.topGoodsId.call());
}

//发布奖品信息
function postGoods(name, amt, description) {
    console.log("postGoods:", name, amt, description);
    web3.personal.unlockAccount(web3.eth.accounts[0], accountsPassword);
    onelive.postGoods.sendTransaction(name, amt, description, txIndex++, {from: web3.eth.accounts[0], gas: 10000000});
}

// 发行代币到用户账户
function mint(receiver, value) {
    console.log("mint:", receiver, value);
    web3.personal.unlockAccount(web3.eth.accounts[0], accountsPassword);
    onelivecoin.mint.sendTransaction(receiver, value, txIndex++, {from: web3.eth.accounts[0], gas: 10000000});
}
