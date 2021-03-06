# FinalProject
Ethereum App

这个基于以太坊的抽奖应用，跟我们日常生活中的抽奖活动相似，比如“刮刮乐”之类的活动，用户通过购买一种可以参与活动的凭证来获得中奖的机会，奖品相关的内容都由主办方发布。

**OneLive**应用的智能合约内容包括以下三部分：

***OneLiveCoin-活动代币合约***

OneLiveCoin合约实现了以太坊的数字货币规范，用户可以使用以太坊钱包添加代币合约，实现对活动代币的管理；设计中OneLiveCoin代币的发行不依赖于自动的代码，而是由活动举办方负责发行代币，举办方应该提供一个服务网站提供代币兑换，用户在网站中填写自己的以太坊账号地址，并支付人民币，举办方网站后台收到支付结果后向用户的以太坊账户发送对应数额代币；

用户在OneLive合约中提交购买请求，OneChane合约自动扣减用户相应金额的代币(即用户用活动代币兑换了奖品的中奖Live)；

***OneLive-抽奖活动合约***

OneLive合约实现了抽奖活动的奖品发布、用户购买奖品中奖Live、自动计算中奖用户功能；只有主办方有权发布奖品信息，奖品信息发布后，用户可以查询奖品信息，在兑换活动代币后，可以用代币兑换奖品的中奖Live；用户提交购买Live请求后，合约自动调用OneLiveCoin合约扣减用户代币，然后将用户加入奖品购买用户列表中；合约并不会自动给用户发放奖品，用户信息中也没有中奖者的收货人姓名地址联系方式等隐私数据；奖品id从1开始递增，如果最新奖品id是0说明主办方还没有发布过奖品；购买用户id从1开始递增，同理如果中奖用户id值为0说明中奖用户还没有计算出。

之后就是实现所谓的开奖，即中奖用户的计算；这一部分一开始就想通过随机数的方式实现，但是在上课的过程中和平时的资料查找中，了解到在区块链上获得一个公平的[真随机数](https://www.cnblogs.com/qwangxiao/p/10084584.html)是一个很大的难题，在网上了解到一些以太坊生成随机数的[方式](https://blog.csdn.net/itcastcpp/article/details/80305787)，感觉这一部分确实有点复杂，这是因为区块链自身结构的特殊性；本项目中随机数的处理参考[Randao](https://www.jianshu.com/p/37e1e2aed913)的方式，在用户购买Live时需要一同提交一个sha3(随机数种子)，在奖品Live售罄后，合约通知所有购买用户提交种子明文；等所有用户的种子明文提交后，使用 sum(所有用户随机数种子)%amt+1 算法计算中奖用户，随机数种子限制为整数，而且大小限制在9223372036854775807以内(受限于web3.js的toHex方法精度)。

***AddressCompress-地址压缩映射合约***

该合约提供20字节address转为4字节uid的地址压缩服务，使用地址压缩，对于重复地址数据，只需要存储一份20字节address与4字节uid的双向映射，然后存储4字节uid即可，方便在交互时调用。

## 使用说明及测试

*准备*

进入命令行，并执行以下命令启动geth控制台

1. geth --datadir "./privatenet" init ./privatenet/genesis.json 2>>oneLive.log 

   使用 genesis.json 文件初始化区块链,该文件为测试用3个用户分配了部分 Ether

   ```json
   {
     "config":{
           "chainId": 10,
           "homesteadBlock": 0,
           "eip155Block": 0,
           "eip158Block": 0
     },
     "alloc": {
       "0x15000430ddbd2ea40ba97185ba7a3e3146761fec": {"balance": "1000000000000000000000000"},
       "0x9f6ac07a81040d0efd1a3d2ac0739ff2a839a4f7": {"balance": "1000000000000000000000000"},
       "0xc2151a8f0a016ded6e0b83d4387159c64285b7d7": {"balance": "1000000000000000000000000"}
     },
     "coinbase"   : "0x0000000000000000000000000000000000000000",
     "difficulty" : "0x20000",
     "extraData"  : "",
     "gasLimit"   : "0xffffffffffffffff",
     "nonce"      : "0x0000000000000042",
     "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
     "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
     "timestamp"  : "0x00"
   }
   ```

2. 创建好私链之后，使用geth --networkid 10 --rpc --rpcapi "db,eth,net.web3,personal,admin,miner" --rpccorsdomain "*" --rpcport "8545" --datadir data --port "30303" console 2>>oneLive.log启动，并且开启rpcapi中的personal选项以支持在页面中解锁账户； 注意这里的启动参数--rpcport如果非8545，需要根据不同需求修改init.js文件的serviceAddress属性配置以太坊节点访问地址

3. miner.start(1);  启动挖矿,已使web页面的合约操作生效

<font color=Tomato style="font-weight:bold;font-style:italic;">测试（点击后到旷工挖矿成功确认之间有延时，需要耐心等待，请不要重复点击，交易确认后页面右上侧会弹出提示框通）</font>

测试环境初始有3个账户,账户密码都是空,账户解锁操作都在js中自动进行;

以太坊节点启动，并且挖矿开始运行后，打开onelive.html页面测试即可，步骤如下

1. 在系统状态页面，点击一键部署按钮，完成合约部署、合约地址设置操作 ；按钮点击后，页面通过js自动发送操作请求到以太坊节点，需要等待挖矿成功以确认交易 ；等待过程中请不要进行其它操作，直到右上角提示条提示合约地址设置成功，在合约状态中能看到所有地址信息都不为0后，才可以继续下一步；

   在主办方界面发布奖品、发行代币 ： 最少发布一个奖品、给最少一个用户发行一定量ChaneCoin代币，操作执行成功后右上侧会有提示通知 ； 奖品发布成功后最新奖品编号会自动更新 ； 代币发行成功后系统状态页面用户账户余额会自动更新;

2. 在用户界面查询奖品信息，购买奖品Live，查询奖品购买用户信息；使用奖品编号可以查询奖品信息，奖品金额-已购买用户数 可以得到奖品可购买Live数量；购买Live界面可以购买奖品，密码输入步骤已省略，购买地址只能从当前节点已有用户中选择，请注意不要填错奖品编号；随机数种子为必填项；购买Live成功后会有提示框通知；当某个奖品全部Live售罄后，会通知用户提交随机数种子，随机数种子的记录和提交由js自动完成，对用户透明；开奖结果会通知给所有用户，用户可以使用奖品信息查询查看中奖用户信息；奖品购买用户查询可以查看购买奖品的所有用户以及随机数种子信息；发送代币功能可以将LiveCoin在用户间转移
