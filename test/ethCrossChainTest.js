const IERC20 = artifacts.require("IERC20");
const ETHCrossChainPool = artifacts.require("ETHCrossChainPool");
contract('ETHCrossChainPool', function (accounts){
    
    it('ETHCrossChainPool normal tests', async function (){
        let fnx = await IERC20.at("0x6084d548B66F03239041c3698Bbcd213d152845F");
        let curTime = Math.floor(new Date().getTime()/1000);
        let ethPool = await ETHCrossChainPool.new(fnx.address,curTime,15,1e15);
        let startTime = await ethPool.startTime();
        let iterval = await ethPool.iterval();
        console.log(startTime.toString(),iterval.toString())
        for (var i=0;i<10;i++){
            await fnx.approve(ethPool.address,(i+1)*1e13,{from:accounts[i]});
            await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
        }
        await logBalance(accounts,ethPool);
        let id = await ethPool.getPeriodID();
        for (var i=0;i<1000 && id.toNumber()<2;i++){
            await ethPool.setPeriodLimited(1e15);
            id = await ethPool.getPeriodID();
            console.log("--",id.toNumber())
        }
        console.log("--------------------------",id.toNumber())
        for (var i=0;i<10;i++){
            await fnx.approve(ethPool.address,(i+1)*1e13,{from:accounts[i]});
            await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
        }
        await logBalance(accounts,ethPool);
        id = await ethPool.getPeriodID();
        for (var i=0;i<1000 && id.toNumber()<3;i++){
            await ethPool.setPeriodLimited(1e15);
            id = await ethPool.getPeriodID();
            console.log("--",id.toNumber())
        }
        console.log("--------------------------",id.toNumber())
        for (var i=0;i<10;i++){
            await fnx.approve(ethPool.address,(i+1)*1e13,{from:accounts[i]});
            await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
        }
        await logBalance(accounts,ethPool);
        id = await ethPool.getPeriodID();
        for (var i=0;i<1000 && id.toNumber()<4;i++){
            await ethPool.setPeriodLimited(1e15);
            id = await ethPool.getPeriodID();
            console.log("--",id.toNumber())
        }
        console.log("--------------------------",id.toNumber())
        for (var i=0;i<10;i++){
            await fnx.approve(ethPool.address,(i+1)*1e13,{from:accounts[i]});
            await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
        }
        await logBalance(accounts,ethPool);
        let poolBalance = await fnx.balanceOf(ethPool.address);
        let balance0 = await fnx.balanceOf(accounts[0]);
        let balance2 = await fnx.balanceOf(accounts[2]);
        await ethPool.redeemTokenAll(accounts[2]);
        let poolBalance1 = await fnx.balanceOf(ethPool.address);
        let balance01 = await fnx.balanceOf(accounts[0]);
        let balance21 = await fnx.balanceOf(accounts[2]);
        console.log(poolBalance.toString(),poolBalance1.toString());
        console.log(balance0.toString(),balance01.toString());
        console.log(balance2.toString(),balance21.toString());

    })
    it('ETHCrossChainPool multiple tests', async function (){
        return;
        let fnx = await IERC20.at("0x6084d548B66F03239041c3698Bbcd213d152845F");
        let curTime = Math.floor(new Date().getTime()/1000);
        let ethPool = await ETHCrossChainPool.new(fnx.address,curTime,25,1e15);
        for (var i=0;i<10;i++){
            await fnx.approve(ethPool.address,"100000000000000000",{from:accounts[i]});
        }
        let startTime = await ethPool.startTime();
        let iterval = await ethPool.iterval();
        console.log(startTime.toString(),iterval.toString())
        for(var j=0;j<3;j++){
            for (var i=0;i<10;i++){
                await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
            }
        }
        await logBalance(accounts,ethPool);
        let id = await ethPool.getPeriodID();
        for (var i=0;i<1000 && id.toNumber()<2;i++){
            await ethPool.setPeriodLimited(1e15);
            id = await ethPool.getPeriodID();
        }
        console.log("--------------------------",id.toNumber())
        for(var j=0;j<4;j++){
            for (var i=0;i<10;i++){
                await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
            }
        }
        await logBalance(accounts,ethPool);
        id = await ethPool.getPeriodID();
        for (var i=0;i<1000 && id.toNumber()<3;i++){
            await ethPool.setPeriodLimited(1e15);
            id = await ethPool.getPeriodID();
        }
        console.log("--------------------------",id.toNumber())
        for(var j=0;j<2;j++){
            for (var i=0;i<10;i++){
                await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
            }
        }
        await logBalance(accounts,ethPool);
        id = await ethPool.getPeriodID();
        for (var i=0;i<1000 && id.toNumber()<4;i++){
            await ethPool.setPeriodLimited(1e15);
            id = await ethPool.getPeriodID();
        }
        console.log("--------------------------",id.toNumber())
        for(var j=0;j<5;j++){
            for (var i=0;i<10;i++){
                await ethPool.crosschainTransfer((i+1)*1e13,{from:accounts[i]});
            }
        }
        await logBalance(accounts,ethPool);
    })
    it('ETHCrossChainPool violation tests', async function (){
        let fnx = await IERC20.at("0x6084d548B66F03239041c3698Bbcd213d152845F");
        let curTime = Math.floor(new Date().getTime()/1000);
        let ethPool = await ETHCrossChainPool.new(fnx.address,curTime,25,1e15);
        await testViolation("User daily crosschain amount exceeded",async function(){
            await fnx.approve(ethPool.address,"100000000000000000");
            await ethPool.crosschainTransfer("100000000000000000"); 
        });
        await testViolation("User daily crosschain amount exceeded",async function(){
            await fnx.approve(ethPool.address,"100000000000000000");
            await ethPool.crosschainTransfer(5e14); 
            await ethPool.crosschainTransfer(4e14); 
            await ethPool.crosschainTransfer(11e13); 
        });
        await testViolation("redeemTokenAll not owner",async function(){
            await ethPool.redeemTokenAll(accounts[1],{from:accounts[9]}); 
        });
    })
})
async function logBalance(accounts,ethPool){
    let id = await ethPool.getPeriodID();
    console.log("id :", id.toString());
    for (var i=0;i<10;i++){
        let balance = await ethPool.getBalance(id,accounts[i]);
        console.log("balance :", i,balance.toString());
    }
    let addrs = await ethPool.getLastPeriodAddressList();
    console.log(addrs);
    addrs = await ethPool.getLastPeriodBalanceList();
    for (var i=0;i<addrs[0].length;i++){
        console.log(addrs[0][i],addrs[1][i].toString());
    }
    
}
async function testViolation(message,testFunc){
    bErr = false;
    try {
        await testFunc();        
    } catch (error) {
        console.log(error);
        bErr = true;
    }
    assert(bErr,message);
}