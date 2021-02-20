pragma solidity ^0.6.7;
import "./IERC20.sol";
import "./Ownable.sol";
contract FNXCrossChainPool is Ownable {
    IERC20 public Erc20Token;
    constructor(address token) public  {
        require(token != address(0),"Empty token address!");
        Erc20Token = IERC20(token);
    }
    function name() external view returns (string memory){
        return Erc20Token.name();
    }
    function symbol() external view returns (string memory){
        return Erc20Token.symbol();
    }
    function decimals() external view returns (uint8){
        return Erc20Token.decimals();
    }
    function mint(address account, uint value)public onlyOwner returns(bool){
        return Erc20Token.transfer(account, value);
    }
    function burn(address account, uint value)public onlyOwner returns(bool){
        return Erc20Token.transferFrom(account, address(this), value);
    }
}