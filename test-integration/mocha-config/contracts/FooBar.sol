pragma solidity ^0.5.0;

contract FooBar {

  function foo() public pure returns (string memory) {
    return "bar";
  }

  function reverts() public pure returns (uint) {
    revert("Just do it!");
  }

  function requires(uint answer) public pure returns (uint) {
    require(answer == 42, "Wrong answer");
  }

}
