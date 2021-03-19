pragma solidity ^0.6.7;
import "./SafeERC20.sol";
import "./Ownable.sol";
contract FNXCrossChainPool is Ownable {
    using SafeERC20 for IERC20;
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
    function totalSupply() external view returns (uint256){
        return Erc20Token.totalSupply();
    }
    function balanceOf(address account) external view returns (uint256){
        return Erc20Token.balanceOf(account);
    }
    function allowance(address owner, address spender) external view returns (uint256){
        return Erc20Token.allowance(owner, spender);
    }
    function mint(address account, uint value)public onlyOwner returns(bool){
        Erc20Token.safeTransfer(account, value);
        return true;
    }
    function burn(address account, uint value)public onlyOwner returns(bool){
        Erc20Token.safeTransferFrom(account, address(this), value);
        return true;
    }
}