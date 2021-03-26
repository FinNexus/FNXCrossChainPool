pragma solidity ^0.6.7;
import "./SafeERC20.sol";
import "./Ownable.sol";
contract ETHCrossChainPool is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    address public token;
    mapping(uint256 => uint256) public userPeriodBalances;
    mapping(uint64=>address[]) public  userPeriodmap;
    uint64 public startTime;
    uint64 public iterval;
    uint256 public periodLimited;
    constructor(address _token,uint64 _startTime,uint64 _iterval,uint256 maxPeriodLimited) public  {
        token = _token;
        startTime = _startTime;
        iterval = _iterval;
        periodLimited = maxPeriodLimited;
    }
    function setPeriodLimited(uint256 maxPeriodLimited)public onlyOwner{
        periodLimited = maxPeriodLimited;
    }
    function setStartTime(uint64 _startTime,uint64 _iterval)public onlyOwner{
        startTime = _startTime;
        iterval = _iterval;
    }
    function crosschainTransfer(uint256 amount) starting maxPeriodBalance(amount) public {
        amount = getPayableAmount(token,amount);
        require(amount > 0, 'transfer amount is zero');
        addBalance(msg.sender,amount);
    }
    function redeemTokenAll(address payable recieptor) public onlyOwner {
        _redeem(recieptor,token,tokenBalance(token));
    }
    function redeemToken(address payable recieptor,uint256 amount) public onlyOwner {
        _redeem(recieptor,token,amount);
    }
    function getLastPeriodAddressList() public view returns(address[] memory){
        return userPeriodmap[getPeriodID()-1];
    }
    function getPeriodAddressList(uint64 period) public view returns(address[] memory){
        return userPeriodmap[period];
    }
    function getLastPeriodBalanceList()public view returns(address[] memory,uint256[] memory){
        return getBalanceList(getPeriodID()-1);
    }
    function getBalanceList(uint64 period)public view returns(address[] memory,uint256[] memory){
        address[] memory userList = userPeriodmap[period];
        uint256[] memory balanceList = new uint256[](userList.length);
        for (uint256 i = 0;i<userList.length;i++){
            balanceList[i] = getBalance(period, userList[i]);
        }
        return (userList,balanceList);
    }
    function addBalance(address user,uint256 amount) internal {
        uint64 period = getPeriodID();
        uint256 key = (uint256(period)<<160)+uint256(user);
        if (userPeriodBalances[key] == 0){
            userPeriodmap[getPeriodID()].push(user);
        }
        userPeriodBalances[key] = userPeriodBalances[key].add(amount);
    }
    function getBalance(uint64 period,address user) public view returns (uint256){
        return userPeriodBalances[(uint256(period)<<160)+uint256(user)];
    }
    function getPeriodID() public view returns (uint64){
        uint64 curTime = uint64(now);
        if (curTime<startTime){
            return 0;
        }
        return (curTime-startTime)/iterval+1;
    }
    function tokenBalance(address _poolToken)internal view returns (uint256){
        if (_poolToken == address(0)){
            return address(this).balance;
        }else{
            return IERC20(_poolToken).balanceOf(address(this));
        }
    }
    function getPayableAmount(address stakeCoin,uint256 amount) internal returns (uint256) {
        if (stakeCoin == address(0)){
            amount = msg.value;
        }else if (amount > 0){
            IERC20 oToken = IERC20(stakeCoin);
            uint256 preBalance = oToken.balanceOf(address(this));
            oToken.safeTransferFrom(msg.sender, address(this), amount);
            uint256 afterBalance = oToken.balanceOf(address(this));
            require(afterBalance-preBalance==amount,"input token transfer error!");
        }
        return amount;
    }
    function _redeem(address payable recieptor,address stakeCoin,uint256 amount) internal{
        if (stakeCoin == address(0)){
            recieptor.transfer(amount);
        }else{
            IERC20 IToken = IERC20(stakeCoin);
            uint256 preBalance = IToken.balanceOf(address(this));
            IToken.safeTransfer(recieptor,amount);
            uint256 afterBalance = IToken.balanceOf(address(this));
            require(preBalance - afterBalance == amount,"settlement token transfer error!");
        }
    }
    modifier starting(){
        require(now >= startTime,"FNX cross chain is not started");
        _;
    }
    modifier maxPeriodBalance(uint256 amount){
        require(getBalance(getPeriodID(),msg.sender)+amount < periodLimited,"User daily crosschain amount is exceeding the maximum limit");
        _;
    }
}